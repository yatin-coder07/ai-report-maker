import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseServer";
import { geminiModel } from "@/lib/gemini";
import { currentUser } from "@clerk/nextjs/server"; // 👈 NEW

export const runtime = "nodejs"; // use Node runtime for Buffer

export async function POST(req: Request) {
  try {
    console.log("\n🟢 [API] /api/report called");

    // 🔐 Get the current Clerk user
    const user = await currentUser();
    if (!user) {
      console.warn("⚠️ No user found (not authenticated)");
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = user.id; // 👈 this will go into Supabase as user_id
    console.log("👤 Authenticated Clerk userId:", userId);

    // 1️⃣ Parse FormData
    const formData = await req.formData();

    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const style = formData.get("style")?.toString();
    const imageFiles = formData.getAll("images") as File[];

    console.log("📦 Received fields:", { title, style });
    console.log("🖼️ Number of images received:", imageFiles.length);

    if (!title || !description || !style) {
      console.warn("⚠️ Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2️⃣ Process images → extract text with Gemini
    const imageTextSnippets: string[] = [];

    for (const [index, file] of imageFiles.entries()) {
      if (!file || !file.type.startsWith("image/")) continue;

      console.log(`\n🧩 Processing image #${index + 1}: ${file.name}`);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");

      console.log("📤 Sending image to Gemini for OCR...");

      const ocrResult = await geminiModel.generateContent([
        {
          text:
            "You are an OCR engine. Read all visible text from this image and return ONLY the raw text (no comments or extra formatting).",
        },
        {
          inlineData: {
            data: base64,
            mimeType: file.type,
          },
        },
      ]);

      const extractedText = ocrResult.response.text().trim();

      if (extractedText) {
        console.log(`✅ Gemini OCR result for image #${index + 1}:`);
        console.log(extractedText);
        imageTextSnippets.push(extractedText);
      } else {
        console.warn(`⚠️ No text extracted from image #${index + 1}`);
      }
    }

    // 3️⃣ Combine description + extracted text
    const combinedNotes =
      imageTextSnippets.length > 0
        ? `${description}

Text extracted from attached images:
${imageTextSnippets.join("\n\n---\n\n")}`
        : description;

    console.log("\n🧾 Combined notes ready for report generation:");
    console.log(combinedNotes.slice(0, 500) + "..."); // print first 500 chars

    // 4️⃣ Build the Gemini prompt
    const prompt = `
      You are an expert report writer.
      Create a structured ${style} report based on the following notes.
      Format it with headings, bullet points, and concise explanations.

      Title: ${title}

      Notes:
      ${combinedNotes}
    `;

    console.log("🚀 Sending prompt to Gemini for report generation...");
    const result = await geminiModel.generateContent(prompt);
    const aiText = result.response.text();

    console.log("✅ Gemini report generated successfully!");
    console.log(aiText.slice(0, 400) + "..."); // preview

    // 5️⃣ Save to Supabase
    console.log("💾 Saving report to Supabase...");

    const { data, error } = await supabase
      .from("reports")
      .insert({
        title,
        input_type: imageFiles.length > 0 ? "text+image" : "text",
        raw_input: combinedNotes,
        report_content: aiText,
        style,
        user_id: userId, // 👈 tie report to this Clerk user
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return NextResponse.json(
        { error: "Database insert failed" },
        { status: 500 }
      );
    }

    console.log("✅ Report saved successfully:", (data as any).id || data);

    return NextResponse.json({ report: data });
  } catch (err) {
    console.error("💥 Route /api/report error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

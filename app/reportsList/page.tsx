// app/reportsList/page.tsx

import supabase from "@/lib/supabaseServer";
import ReportsListClient from "./ReportsListClient";
import { currentUser } from "@clerk/nextjs/server"; // 👈 NEW

type ReportRow = {
  id: string; // we won't *use* it in logic, just needed for key
  title: string;
  style: string | null;
  created_at: string;
  raw_input: string | null;
  report_content: string | null;
};

export default async function Page() {
  // 🔐 Get the logged-in Clerk user
  const user = await currentUser();

  if (!user) {
    return (
      <main className="px-4 pt-24 pb-16 flex justify-center">
        <p className="text-sm text-muted-foreground">
          Please sign in to view your reports.
        </p>
      </main>
    );
  }

  // 🔑 This is what we saved as user_id in /api/report
  const userId = user.id;

  const { data, error } = await supabase
    .from("reports")
    .select("id, title, style, created_at, raw_input, report_content")
    .eq("user_id", userId) // 👈 filter by THIS user only
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reports:", error);
    return (
      <main className="px-4 pt-24 pb-16 flex justify-center">
        <p className="text-sm text-red-500">
          Failed to load reports. Please try again later.
        </p>
      </main>
    );
  }

  const reports = (data ?? []) as ReportRow[];

  return (
    <main className="px-4 pt-24 pb-16 flex justify-center">
      <section className="w-full max-w-5xl space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wide mx-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-muted-foreground">
              Your report library
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold leading-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Created reports
          </h1>

          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Every report you generate with ReMake is saved here. Click on a
            title to expand the card and review your original notes alongside
            the AI-generated report.
          </p>
        </div>

        {/* Content */}
        {reports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-8 text-center space-y-3">
            <div className="text-3xl">📝</div>
            <p className="text-sm text-muted-foreground">
              No reports yet. Go back to the home page and generate your first
              report.
            </p>
          </div>
        ) : (
          <div className="w-full">
            <ReportsListClient reports={reports} />
          </div>
        )}
      </section>
    </main>
  );
}

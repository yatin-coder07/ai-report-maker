"use client";

import { useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import ImageDropzone from "./ImageDropZone";
import { motion, AnimatePresence } from "framer-motion";

function Hero() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState<string | undefined>(undefined);
  const [images, setImages] = useState<File[]>([]);

  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copyLabel, setCopyLabel] = useState("Copy report");

  const handleCreateClick = () => {
    if (!isSignedIn) return;
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setCopyLabel("Copy report");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (style) formData.append("style", style);

      images.forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch("/api/report", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || "Failed to generate report");
      }

      const data = await res.json();
      console.log("Generated report:", data.report);

      if (data.report?.report_content) {
        setGeneratedReport(data.report.report_content);
        setTitle("");
        setDescription("");
        setStyle(undefined);
        setImages([]);
      } else {
        throw new Error("No report content returned from server");
      }
    } catch (err: any) {
      console.error("Error in handleSubmit:", err);
      setErrorMsg(
        err.message || "Something went wrong while generating report."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyReport = async () => {
    if (!generatedReport) return;
    try {
      await navigator.clipboard.writeText(generatedReport);
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy report"), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
      setCopyLabel("Copy failed");
      setTimeout(() => setCopyLabel("Copy report"), 1500);
    }
  };

  const handleGoToReports = () => {
    router.push("/reportsList");
  };

  return (
    <main className="flex flex-col items-center px-4 pt-24 pb-16">
      {/* Hero text */}
      <motion.section
        className="max-w-3xl text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wide mx-auto mb-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">
            AI-powered report workspace
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          ReMake – AI Report Workspace
        </h1>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Turn messy notes, screenshots, or handwritten thoughts into clean,
          structured reports. Upload text and images, and let AI handle the
          formatting, clarity, and structure.
        </p>

        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          Perfect for weekly updates, client summaries, study notes, and
          documentation. Your reports stay saved and accessible anytime.
        </p>

        {/* Call to action */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {isSignedIn ? (
            <>
              <Button
                size="lg"
                className="rounded-2xl px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-sm sm:text-base font-medium shadow-md hover:opacity-90 transition-opacity hover:cursor-pointer"
                onClick={handleCreateClick}
              >
                Create a report
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="rounded-2xl px-6 py-3 text-sm sm:text-base border-gray-300/60 dark:border-gray-600 hover:bg-white/60 dark:hover:bg-zinc-900/60"
                onClick={handleGoToReports}
              >
                View created reports
              </Button>
            </>
          ) : (
            <SignInButton mode="modal">
              <Button
                size="lg"
                className="rounded-2xl px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-sm sm:text-base font-medium shadow-md hover:opacity-90 transition-opacity hover:cursor-pointer"
              >
                Sign in to create a report
              </Button>
            </SignInButton>
          )}
        </div>
      </motion.section>

      {/* Form section */}
      <AnimatePresence>
        {isSignedIn && showForm && (
          <motion.section
            className="w-full max-w-2xl mt-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/75 dark:bg-zinc-900/70 backdrop-blur-xl shadow-md p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Create a new report
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                    Start with a clear title, add your notes or rough thoughts,
                    and optionally upload images or screenshots. ReMake will
                    synthesize everything into a structured report.
                  </p>
                </div>
                <span className="hidden sm:inline-flex text-[11px] px-2 py-1 rounded-full border border-gray-300/70 dark:border-zinc-700 text-muted-foreground">
                  ~ 5–10 seconds to generate
                </span>
              </div>

              {errorMsg && (
                <p className="text-xs sm:text-sm text-red-500">{errorMsg}</p>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Title
                  </label>
                  <Input
                    placeholder="Weekly development update, client summary, study notes..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-white/80 dark:bg-zinc-900/70 border border-gray-300/80 dark:border-zinc-700/80 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500"
                  />
                </div>

                {/* Description + Images */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Description / Notes
                  </label>
                  <Textarea
                    placeholder="Paste your notes, bullet points, or a rough idea of what the report should include."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    required
                    disabled={isLoading}
                    className="bg-white/80 dark:bg-zinc-900/70 border border-gray-300/80 dark:border-zinc-700/80 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 text-sm"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    You can also attach screenshots, whiteboard photos, or
                    handwritten notes below. They&apos;ll be read and included
                    in the report.
                  </p>
                  <ImageDropzone onImagesChange={setImages} />
                </div>

                {/* Style select */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Report style
                  </label>
                  <Select
                    value={style}
                    onValueChange={(value) => setStyle(value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full rounded-xl bg-white/80 dark:bg-zinc-900/70 border border-gray-300/80 dark:border-zinc-700/80 text-sm">
                      <SelectValue placeholder="Choose a style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="student">
                        Student / Academic
                      </SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="casual">Casual / Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-xs sm:text-sm rounded-xl"
                    onClick={() => setShowForm(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="text-xs sm:text-sm rounded-xl px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 shadow-sm hover:opacity-90 transition-opacity hover:cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? "Generating..." : "Generate report"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Generated report section */}
      <AnimatePresence>
        {isSignedIn && generatedReport && (
          <motion.section
            className="w-full max-w-3xl mt-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-md p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-50/80 dark:bg-emerald-500/10 px-3 py-1 mb-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                      Report ready
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Generated report
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    This is your AI-generated report based on the notes, images,
                    and style you provided.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm rounded-xl"
                    onClick={handleCopyReport}
                  >
                    {copyLabel}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm rounded-xl"
                    onClick={handleGoToReports}
                  >
                    View all reports
                  </Button>
                </div>
              </div>

              <div className="mt-2 text-sm sm:text-base leading-relaxed whitespace-pre-wrap max-h-[480px] overflow-y-auto">
                {generatedReport}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

export default Hero;

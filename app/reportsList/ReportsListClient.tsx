// app/reportsList/ReportsListClient.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ReportRow = {
  id: string;
  title: string;
  style: string | null;
  created_at: string;
  raw_input: string | null;
  report_content: string | null;
};

type Props = {
  reports: ReportRow[];
};

export default function ReportsListClient({ reports }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <motion.ul
      className="space-y-3"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.04,
          },
        },
      }}
    >
      {reports.map((report, index) => {
        const isOpen = openIndex === index;

        return (
          <motion.li
            key={report.id ?? index}
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.2 }}
            className={`border border-gray-200 dark:border-gray-700 dark:hover:border-green-400 transition-colors rounded-xl bg-white/60 dark:bg-zinc-900/70 backdrop-blur-md ${
              isOpen ? "border-blue-400" : "hover:border-blue-400"
            }`}
          >
            {/* Header row – same design, now animated list item */}
            <button
              type="button"
              onClick={() => handleToggle(index)}
              className="block w-full px-4 py-3 text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-md">
                <span className="text-sm sm:text-base font-medium hover:underline">
                  {report.title}
                </span>
                <span className="text-[11px] sm:text-xs text-muted-foreground">
                  {report.style ? report.style : "default"} ·{" "}
                  {new Date(report.created_at).toLocaleString()}
                </span>
              </div>
            </button>

            {/* Expanded content with smooth open/close */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-3">
                    <div className="max-h-64 overflow-y-auto rounded-xl bg-black/5 dark:bg-zinc-900/50 p-3 text-sm">
                      <h3 className="font-semibold mb-1">Original notes</h3>
                      <pre className="whitespace-pre-wrap">
                        {report.raw_input || "No raw input available"}
                      </pre>
                    </div>

                    <div className="max-h-64 overflow-y-auto rounded-xl bg-white/80 dark:bg-zinc-900/80 p-3 border border-gray-200/60 dark:border-zinc-700/60 text-sm">
                      <h3 className="font-semibold mb-1">Generated report</h3>
                      <div className="whitespace-pre-wrap">
                        {report.report_content || "No generated content yet."}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}

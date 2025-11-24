"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-20 border-t border-gray-200/70 dark:border-gray-800 bg-white/60 dark:bg-zinc-900/70 backdrop-blur-xl">
      <motion.div
        className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* Left Section */}
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            ReMake
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            AI-powered report workspace. Built for clarity, speed, and creativity.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-5">
          <Link
            href="https://github.com/yatin-coder07"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full border border-gray-300/60 dark:border-gray-700/60 hover:bg-gray-100/50 dark:hover:bg-zinc-800 transition-all"
          >
            <Github className="h-4 w-4 text-muted-foreground hover:text-blue-500 transition-colors" />
          </Link>

          <Link
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full border border-gray-300/60 dark:border-gray-700/60 hover:bg-gray-100/50 dark:hover:bg-zinc-800 transition-all"
          >
            <Linkedin className="h-4 w-4 text-muted-foreground hover:text-blue-500 transition-colors" />
          </Link>

          <Link
            href="https://www.linkedin.com/in/yatin-sharma-12a34428b/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full border border-gray-300/60 dark:border-gray-700/60 hover:bg-gray-100/50 dark:hover:bg-zinc-800 transition-all"
          >
            <Twitter className="h-4 w-4 text-muted-foreground hover:text-blue-500 transition-colors" />
          </Link>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200/60 dark:border-gray-800 py-4">
        <p className="text-center text-[11px] sm:text-xs text-muted-foreground">
          © {new Date().getFullYear()} ReMake. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

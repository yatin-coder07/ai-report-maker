"use client";

import { motion } from "framer-motion";
import { Brain, FileText, Image, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "AI-Powered Reports",
    description:
      "Transform unstructured notes and ideas into polished, professional reports in seconds using advanced Gemini AI models.",
    icon: Brain,
  },
  {
    title: "Image-to-Text Intelligence",
    description:
      "Upload handwritten notes, screenshots, or whiteboard photos — the AI reads and integrates them seamlessly into your report.",
    icon: Image,
  },
  {
    title: "Instant Organization",
    description:
      "ReMake automatically formats your report with headings, bullets, and summaries so you never worry about structure again.",
    icon: FileText,
  },
  {
    title: "Secure and Private",
    description:
      "Your reports are stored safely on Supabase with strict data privacy. Only you can access your generated content.",
    icon: ShieldCheck,
  },
];

export default function Features() {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-20 space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center space-y-3"
      >
        <h2 className="text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Why Choose ReMake
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
          Streamline your workflow with AI-enhanced reporting tools designed for clarity, speed, and creativity.
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-sm hover:shadow-md hover:scale-[1.02] transition-all p-6 flex flex-col items-start space-y-3"
            >
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <Icon className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

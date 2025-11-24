"use client";

import {
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function Navbar() {
  const { isSignedIn } = useUser();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="backdrop-blur-md bg-white/10 dark:bg-black/30 border-b border-white/20 sticky top-0 z-50">
      <div className="w-full mx-auto flex items-center justify-between px-6 py-3">
        {/* Brand / Logo */}
       <Link href="/">
          <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            ReMake
          </span>
        </Link>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          {mounted && (
            <motion.button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="relative h-10 w-10 rounded-full border border-white/20 bg-white/10 dark:bg-black/40 backdrop-blur-md flex items-center justify-center overflow-hidden hover:border-white/40"
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {resolvedTheme === "dark" ? (
                  <motion.span
                    key="moon"
                    className="flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.3, rotate: -90 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.3, rotate: 90 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Moon className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="sun"
                    className="flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.3, rotate: 90 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.3, rotate: -90 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Sun className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )}

          {isSignedIn ? (
            <>
             
               <a href="/reportsList">
               <button className="px-4 py-2 dark:bg-white/10 bg-white rounded-xl dark:text-white text-black dark:border-none border border-black text-sm font-medium hover:opacity-70 transition-opacity hover:cursor-pointer  " >
                My Reports
              </button>
            </a>
              <SignOutButton>
                <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity hover:cursor-pointer">
                  Sign Out
                </button>
              </SignOutButton>
               <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "h-9 w-9 border border-white/20 rounded-full hover:scale-105 transition-transform",
                  },
                }}
              />
            </>
          ) : (
            <>
                <SignInButton>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity">
                Sign In
              </button>
            </SignInButton>
           
            </>
        
            
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

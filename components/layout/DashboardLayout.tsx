"use client";

import { motion } from "framer-motion";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <motion.main
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      className="
      min-h-[calc(100vh-72px)]
      w-full
      px-6
      py-8
      lg:px-10
      xl:px-14
      max-w-screen-2xl
      mx-auto
      "
    >
      {children}
    </motion.main>
  );
}
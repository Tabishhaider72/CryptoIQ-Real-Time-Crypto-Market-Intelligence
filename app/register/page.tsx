"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main
      className="
      min-h-[calc(100vh-72px)]
      flex
      items-center
      justify-center
      px-6
      py-10
      bg-background
      overflow-hidden
      relative
    "
    >
      <div
        className="
        absolute
        inset-0
        -z-10
        bg-gradient-to-br
        from-primary/10
        via-background
        to-cyan-500/10
      "
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="
          w-full
          max-w-md
          space-y-6
        "
      >
        <div className="space-y-2 text-center">
          <h1
            className="
            text-4xl
            font-bold
            tracking-tight
          "
          >
            Create Account
          </h1>

          <p className="text-muted-foreground">
            Start tracking crypto markets
          </p>
        </div>

        <RegisterForm />

        <p
          className="
          text-center
          text-sm
          text-muted-foreground
        "
        >
          Already have an account?{" "}
          <Link
            href="/login"
            className="
            text-primary
            font-medium
            hover:underline
          "
          >
            Login
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
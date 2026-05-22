"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  LogOut,
  User,
  ChevronDown,
  BarChart3,
  BriefcaseBusiness,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";

const products = [
  {
    href: "/portfolio",
    icon: BriefcaseBusiness,
    label: "Portfolio",
    description: "Track holdings & P&L",
  },
  {
    href: "/alerts",
    icon: Bell,
    label: "Price Alerts",
    description: "Get notified on price targets",
  },
  {
    href: "/analytics",
    icon: BarChart3,
    label: "Analytics",
    description: "Volatility & correlations",
  },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close dropdown on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
    >
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="text-primary">₿</span>
          <span>CryptoIQ</span>
        </Link>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/dashboard"
            className={`px-4 py-2 rounded-lg text-sm transition ${
              pathname === "/dashboard"
                ? "text-foreground bg-muted"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            Market
          </Link>

          {/* Products Dropdown */}
          <div ref={ref} className="relative">
            <button
              onClick={() => setOpen((p) => !p)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition ${
                open
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Products
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-2xl border border-border bg-background shadow-xl shadow-black/20 overflow-hidden"
                >
                  <div className="p-2">
                    {products.map((item) => {
                      const Icon = item.icon;
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-start gap-3 px-3 py-3 rounded-xl transition group ${
                            active
                              ? "bg-muted"
                              : "hover:bg-muted/60"
                          }`}
                        >
                          <div className={`mt-0.5 p-1.5 rounded-lg ${
                            active ? "bg-foreground text-background" : "bg-muted text-muted-foreground group-hover:bg-foreground group-hover:text-background"
                          } transition`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${active ? "text-foreground" : ""}`}>
                              {item.label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <ThemeTogglerButton />

          {session ? (
            <>
              <Button
                variant="secondary"
                onClick={() => router.push("/dashboard")}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>

              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => router.push("/login")}>
                Login
              </Button>
              <Button onClick={() => router.push("/register")}>
                <User className="h-4 w-4 mr-2" />
                Register
              </Button>
            </>
          )}
        </div>

      </div>
    </motion.nav>
  );
}
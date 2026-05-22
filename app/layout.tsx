import type { Metadata } from "next";

import {
  Geist,
  Geist_Mono,
  Roboto_Mono,
} from "next/font/google";

import { Toaster } from "sonner";

import "./globals.css";

import { Navbar } from "@/components/layout/Navbar";

import { Providers } from "@/components/theme/Providers";

const geistSans = Geist({
  variable:
    "--font-geist-sans",

  subsets: ["latin"],
});

const geistMono =
  Geist_Mono({
    variable:
      "--font-geist-mono",

    subsets: ["latin"],
  });

const robotoMono =
  Roboto_Mono({
    variable:
      "--font-roboto-mono",

    subsets: ["latin"],

    weight: [
      "100",
      "300",
      "400",
      "500",
      "700",
    ],
  });

export const metadata:
Metadata = {

title:
"Crypto Platform",

description:
"Real-time crypto dashboard",

};

export default function RootLayout({

children,

}:Readonly<{
children:
React.ReactNode
}>){

return(

<html
lang="en"

className={`
${geistSans.variable}
${geistMono.variable}
${robotoMono.variable}
h-full
antialiased
`}

suppressHydrationWarning
>

<body
className="
min-h-full
flex
flex-col
bg-background
"
>

<Providers>

<Navbar />

<main className="flex-1">
{children}
</main>

<Toaster
position="top-right"
richColors
closeButton
/>

</Providers>

</body>

</html>

)

}
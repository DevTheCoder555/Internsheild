import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InternShield AI - Detect Fake Internships & Scam Recruiters",
  description:
    "AI-powered platform to detect fake internship offers, scam recruiters, and fraudulent job postings. Protect yourself from scam internship advertisements.",
  keywords: [
    "fake internship",
    "scam detection",
    "internship verification",
    "recruiter scam",
    "AI scam detection",
    "student safety",
  ],
  authors: [{ name: "InternShield AI" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#0a0e1a] text-white antialiased`}>
        <div className="relative flex min-h-screen flex-col">
          {/* Background gradient effects */}
          <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-600/10 blur-[100px]" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-600/10 blur-[100px]" />
          </div>

          <Navbar />

          <main className="flex-1 relative z-10">{children}</main>

          <Footer />
        </div>

        <Toaster />
      </body>
    </html>
  );
}

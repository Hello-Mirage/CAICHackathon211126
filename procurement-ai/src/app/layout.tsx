import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";

export const metadata: Metadata = {
  title: "Vinayak Group — AI Procurement Copilot | TerminaLABS",
  description:
    "AI-assisted construction procurement copilot for Vinayak Group. Automated 12-step SOP to 6 AI stages: requirement ingestion, Farvision ERP item code resolution, multi-vendor quotation normalisation, comparative statement, and HOD approval.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
      data-theme="dark"
    >
      <body className="min-h-full flex flex-col font-sans transition-colors duration-200">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}


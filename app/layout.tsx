import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnalyticsLoader from "@/components/AnalyticsLoader";

export const metadata: Metadata = {
  title: "BrightWave Digital — AI & Digital Marketing Demo",
  description:
    "Demo company website for the AI & Digital Marketing class. Manage everything from the visual Admin panel.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <AnalyticsLoader />
      </body>
    </html>
  );
}

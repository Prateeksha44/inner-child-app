import { Baloo_2, Quicksand } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-baloo",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-quicksand",
});

export const metadata = {
  title: "Connect with Your Inner Child",
  description: "Tiny adventures, every day.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${baloo.variable} ${quicksand.variable}`}>
      <body className="font-body bg-cream text-ink">{children}</body>
    </html>
  );
}
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CSWD Biñan City Portal",
  description: "City Social Welfare and Development Office",
  manifest: "/manifest.json",
  icons: {
    icon: "/cswd.png",
    shortcut: "/cswd.png",
    apple: "/cswd.png",
  },
  appleWebApp: {
    capable: true,
    title: "CSWD Biñan",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e3a8a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/cswd.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
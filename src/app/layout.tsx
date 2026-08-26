import "./globals.css";

export const metadata = {
  title: "CSWD Biñan City Portal",
  description: "City Social Welfare and Development Office",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

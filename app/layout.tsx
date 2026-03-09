import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "GAMITSVALE.GE — გაცვალე საქართველოში",
  description: "Georgian Swap & Barter Marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka">
      <head>
        <script src="https://accounts.google.com/gsi/client" async defer />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}

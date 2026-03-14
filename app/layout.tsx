import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: {
    default: "GAMITSVALE.GE — გაცვლის პლატფორმა",
    template: "%s | GAMITSVALE.GE",
  },
  description:
    "საქართველოს პირველი გაცვლის პლატფორმა. გაცვალე ნივთები ფულის გარეშე.",
  keywords: [
    "გაცვლა",
    "barter",
    "ნივთების გაცვლა",
    "საქართველო",
    "გაცვლის საიტი",
  ],
  openGraph: {
    title: "GAMITSVALE.GE - ნივთების გაცვლის პლატფორმა",
    description: "გაცვალე ნივთები ფულის გარეშე",
    url: "https://gamitsvale.ge",
    siteName: "GAMITSVALE.GE",
    locale: "ka_GE",
    type: "website",
    images: [
      { url: "https://gamitsvale.ge/og-image.jpg", width: 1200, height: 630 },
    ],
  },
  icons: {
    icon: "/favicon.svg",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "https://gamitsvale.ge" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka">
      <head>
        <script
          src="https://accounts.google.com/gsi/client"
          async={true}
          defer={true}
        />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { LanguageProvider } from "./i18n";
import HowItWorks from "./components/HowItWorks";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StellarProof | Private KYC on Stellar",
  description: "Privacy-preserving KYC verification using zero-knowledge proofs on Stellar.",
};

const themeScript = `
(function () {
  try {
    var t = localStorage.getItem("theme");
    var dark = t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
        <Header />
        {children}
        <HowItWorks />
        <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}


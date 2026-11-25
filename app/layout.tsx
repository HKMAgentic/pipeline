import type { Metadata } from "next";
import "./globals.css";
import { Barlow_Condensed, Public_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/presentation/theme-provider";

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-public-sans" });
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  title: "Pipeline",
  description: "Mini CRM de prospection",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning : next-themes ajoute la classe .dark avant l'affichage,
    // React ne doit pas le signaler comme une erreur.
    <html
      lang="fr"
      className={cn("font-sans", publicSans.variable, barlowCondensed.variable)}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import "@uploadthing/react/styles.css";
import "./globals.css";
import { Toaster } from "@/src/components/ui/toaster";
import { siteConfig } from "@/src/config/site";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { Poppins } from "next/font/google";
import Provider from "../components/global/providers";
import { cn } from "../lib/utils";
import { RootLayoutProps } from "../types";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700"],
    variable: "--font-poppins",
});

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `${siteConfig.name} | %s`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [
        {
            name: siteConfig.name,
            url: siteConfig.url,
        },
    ],
    creator: siteConfig.name,
    themeColor: [{ color: "black" }],
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
        images: [`${siteConfig.url}/og.png`],
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
        images: [`${siteConfig.url}/og.png`],
        creator: "@itsdrvgo",
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },
    metadataBase: new URL(siteConfig.url),
    manifest: `${siteConfig.url}/site.webmanifest`,
};

function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body
                className={cn(
                    poppins.className,
                    "min-h-screen overflow-x-hidden scroll-smooth antialiased"
                )}
            >
                <Provider>{children}</Provider>
                <Analytics />
                <Toaster />
            </body>
        </html>
    );
}

export default RootLayout;

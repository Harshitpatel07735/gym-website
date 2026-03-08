import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/common/SmoothScroll";
import CustomCursor from "@/components/common/CustomCursor";
import GrainOverlay from "@/components/common/GrainOverlay";
import GradientOrbs from "@/components/common/GradientOrbs";
import WhatsAppShortcut from "@/components/common/WhatsAppShortcut";


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "FORGE | Premium Fitness Experience",
    description: "Break your limits with APEX FITNESS. State-of-the-art equipment and elite coaching.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={`${inter.variable} font-sans bg-background text-foreground antialiased selection:bg-primary selection:text-white`} suppressHydrationWarning>
                <CustomCursor />
                <GrainOverlay />
                <GradientOrbs />
                <WhatsAppShortcut />
                <SmoothScroll>
                    {children}
                </SmoothScroll>
            </body>
        </html>
    );
}

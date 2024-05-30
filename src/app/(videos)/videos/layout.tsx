import { Footer, Navbar, NavbarMob } from "@/components/global/layouts";
import { LayoutProps } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Videos",
    description: "Watch my videos on music, and programming",
};

function Layout({ children }: LayoutProps) {
    return (
        <>
            <div className="relative flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
            <NavbarMob />
        </>
    );
}

export default Layout;

"use client";

import { homeMenuConfig } from "@/src/config/menu";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import LoginButton from "./login-button";
import { MainNav } from "./main-nav";

function HomeNavbar({ className }: DefaultProps) {
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        latest > previous && latest > 100 ? setHidden(true) : setHidden(false);
    });

    return (
        <motion.header
            variants={{
                hidden: {
                    y: "-100%",
                },
                visible: {
                    y: 0,
                },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{
                duration: 0.35,
                ease: "easeInOut",
            }}
            className={cn(
                "sticky top-0 z-40 w-full border-b border-border bg-transparent backdrop-blur-sm",
                className
            )}
        >
            <div className="container flex h-20 items-center justify-between py-6">
                <MainNav
                    items={homeMenuConfig}
                    className="flex gap-6 md:gap-10"
                />
                <nav>
                    <LoginButton />
                </nav>
            </div>
        </motion.header>
    );
}

export default HomeNavbar;

"use client";

import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import GoBackButton from "../../global/buttons/go-back-button";
import { EmptyPlaceholder } from "../../ui/empty-placeholder";

function ChatNoAccess({ className, ...props }: DefaultProps) {
    return (
        <div
            className={cn(
                "relative flex h-screen flex-1 flex-col justify-between",
                className
            )}
            style={{
                backgroundImage: "url(/patterns/chat_bg.png)",
                backgroundSize: "cover",
            }}
            {...props}
        >
            <section className="flex h-full flex-col items-center justify-center p-5">
                <EmptyPlaceholder
                    title="Access Denied"
                    description="You are not allowed to access the content of this page."
                    icon="warning"
                    className="max-w-md"
                    endContent={<GoBackButton />}
                />
            </section>
        </div>
    );
}

export default ChatNoAccess;

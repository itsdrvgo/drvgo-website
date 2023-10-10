"use client";

import { cn } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps } from "@/src/types";
import { CachedUser } from "@/src/types/cache";
import { Button, Textarea } from "@nextui-org/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Icons } from "../icons/icons";

interface PageProps extends DefaultProps {
    chatPartner: CachedUser;
    chatId: string;
}

function ChatInput({ className, chatPartner, chatId, ...props }: PageProps) {
    const textareaRef = useRef<HTMLInputElement | null>(null);
    const [input, setInput] = useState("");

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const sendMessage = () => {
        if (input.length === 0) return;

        setInput("");
        textareaRef.current?.focus();

        const body = {
            text: input,
            chatId,
        };

        axios
            .post<ResponseData>("/api/chats/send", JSON.stringify(body))
            .then(({ data: resData }) => {
                if (resData.code !== 201) return toast.error(resData.message);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Something went wrong, try again later!");
            });
    };

    return (
        <section
            className={cn(
                "flex items-center justify-between gap-3 px-4 py-2",
                className
            )}
            {...props}
        >
            <Textarea
                ref={textareaRef}
                variant="bordered"
                radius="sm"
                aria-label="Message"
                minRows={1}
                maxRows={6}
                value={input}
                placeholder={`Message @${chatPartner.username}`}
                onValueChange={(value) => setInput(value)}
                classNames={{
                    inputWrapper: "bg-background border-1 border-border",
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                    }
                }}
            />
            <Button
                isIconOnly
                isDisabled={input.length === 0}
                radius="sm"
                color="primary"
                type="submit"
                onPress={sendMessage}
                startContent={<Icons.sendHorizontal className="h-5 w-5" />}
            />
        </section>
    );
}

export default ChatInput;

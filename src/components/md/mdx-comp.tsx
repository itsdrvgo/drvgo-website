"use client";

import { cn } from "@/src/lib/utils";
import Link from "next/link";
import { HTMLAttributes, ImgHTMLAttributes, useState } from "react";
import ReactMarkdown from "react-markdown";
import { SpecialComponents } from "react-markdown/lib/ast-to-react";
import { NormalComponents } from "react-markdown/lib/complex-types";
import { ReactMarkdownOptions } from "react-markdown/lib/react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { Icons } from "../icons/icons";

const components: Partial<
    Omit<NormalComponents, keyof SpecialComponents> & SpecialComponents
> = {
    h1: ({ className, ...props }) => (
        <h1
            className={cn(
                "mt-2 scroll-m-20 text-4xl font-bold tracking-tight",
                className
            )}
            {...props}
        />
    ),
    h2: ({ className, id, ...props }) => (
        <h2
            className={cn(
                "mt-8 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0",
                className
            )}
            id={props.children
                .toString()
                .toLowerCase()
                .replace(/\s/g, "-")
                .replace(/:$/, "")}
            {...props}
        >
            <Link
                href={
                    "#" +
                    props.children
                        .toString()
                        .toLowerCase()
                        .replace(/\s/g, "-")
                        .replace(/:$/, "")
                }
                className="flex items-center gap-3"
            >
                <div>
                    <Icons.link className="h-5 w-5 text-gray-400" />
                </div>
                {props.children}
            </Link>
        </h2>
    ),
    h3: ({ className, id, ...props }) => (
        <h3
            className={cn(
                "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
                className
            )}
            id={props.children
                .toString()
                .toLowerCase()
                .replace(/\s/g, "-")
                .replace(/:$/, "")}
            {...props}
        >
            <Link
                href={
                    "#" +
                    props.children
                        .toString()
                        .toLowerCase()
                        .replace(/\s/g, "-")
                        .replace(/:$/, "")
                }
            >
                {props.children}
            </Link>
        </h3>
    ),
    h4: ({ className, ...props }) => (
        <h4
            className={cn(
                "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
                className
            )}
            {...props}
        />
    ),
    h5: ({ className, ...props }) => (
        <h5
            className={cn(
                "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
                className
            )}
            {...props}
        />
    ),
    h6: ({ className, ...props }) => (
        <h6
            className={cn(
                "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
                className
            )}
            {...props}
        />
    ),
    a: ({ className, ...props }) => (
        <a
            className={cn(
                "font-semibold underline underline-offset-4",
                className
            )}
            {...props}
        />
    ),
    p: ({ className, ...props }) => (
        <p
            className={cn("leading-7 [&:not(:first-child)]:mt-4", className)}
            {...props}
        />
    ),
    ul: ({ className, ...props }) => (
        <ul className={cn("my-2 ml-6 list-disc", className)} {...props} />
    ),
    ol: ({ className, ...props }) => (
        <ol className={cn("my-2 ml-6 list-decimal", className)} {...props} />
    ),
    li: ({ className, ...props }) => (
        <li className={cn("mt-2", className)} {...props} />
    ),
    blockquote: ({ className, ...props }) => (
        <blockquote
            className={cn(
                "mt-4 rounded border-l-2 border-white bg-gray-900 px-6 py-2 italic [&>*]:text-muted-foreground",
                className
            )}
            {...props}
        />
    ),
    img: ({
        className,
        alt,
        ...props
    }: ImgHTMLAttributes<HTMLImageElement>) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            className={cn("rounded-md border", className)}
            alt={alt}
            {...props}
        />
    ),
    hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
    table: ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => (
        <div className="my-6 w-full overflow-y-auto">
            <table className={cn("w-full", className)} {...props} />
        </div>
    ),
    tr: ({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
        <tr
            className={cn("m-0 border-t p-0 even:bg-muted", className)}
            {...props}
        />
    ),
    th: ({ className, ...props }) => (
        <th
            className={cn(
                "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
                className
            )}
            {...props}
        />
    ),
    td: ({ className, ...props }) => (
        <td
            className={cn(
                "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
                className
            )}
            {...props}
        />
    ),
    pre: ({ className, ...props }) => (
        <pre
            className={cn(
                "bg-code my-4 overflow-x-auto rounded-lg border p-4",
                className
            )}
            {...props}
        />
    ),
    code: ({ className, node, inline, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || "");

        return !inline && match ? (
            <div className="relative">
                <SyntaxHighlighter
                    {...props}
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                        border: "none",
                        padding: "0.5rem",
                        margin: 0,
                    }}
                    showLineNumbers
                    lineNumberStyle={{
                        minWidth: "2rem",
                        paddingRight: "1rem",
                        textAlign: "right",
                    }}
                >
                    {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>

                <button
                    className="absolute right-2 top-2 rounded-md border border-gray-600 p-2 text-gray-500"
                    onClick={() => {
                        navigator.clipboard.writeText(
                            String(children).replace(/\n$/, "")
                        );
                    }}
                >
                    <Icons.copy className="h-4 w-4" />
                </button>
            </div>
        ) : (
            <code
                {...props}
                className={cn(
                    "relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm",
                    className
                )}
            >
                {children}
            </code>
        );
    },
};

export function Mdx({ children }: ReactMarkdownOptions) {
    return (
        <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
            {children}
        </ReactMarkdown>
    );
}

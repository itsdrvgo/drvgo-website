"use client";

import { NewComment, User } from "@/src/lib/drizzle/schema";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps, ExtendedComment } from "@/src/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Icons } from "../icons/icons";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useToast } from "../ui/use-toast";

interface PageProps extends DefaultProps {
    user: User;
    params: {
        blogId: string;
    };
    comment: ExtendedComment;
}

function BlogCommentOperation({ user, params, comment }: PageProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isPinned, setIsPinned] = useState(comment.pinned);
    const [isEditing, setIsEditing] = useState(false);
    const [commentText, setCommentText] = useState(comment.content);
    const [isPosting, setIsPosting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (commentText === comment.content) setIsEditing(false);
        else setIsEditing(true);
    }, [comment.content, commentText]);

    const handleCommentDelete = () => {
        axios
            .delete<ResponseData>(
                `/api/blogs/comments/${params.blogId}/${comment.id}`
            )
            .then(({ data: resData }) => {
                if (resData.code !== 200)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                router.refresh();
                toast({
                    description: "Comment deleted",
                });
            })
            .catch((err) => {
                console.log(err);
                return toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
            });
    };

    const handleCommentPin = () => {
        axios
            .post<ResponseData>(
                `/api/blogs/comments/${params.blogId}/${comment.id}/${
                    isPinned ? "unpin" : "pin"
                }`,
                {}
            )
            .then(({ data: resData }) => {
                if (resData.code !== 200)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                setIsPinned(!isPinned);
                toast({
                    description: `Comment ${isPinned ? "unpinned" : "pinned"}`,
                });
                router.refresh();
            })
            .catch((err) => {
                console.log(err);
                return toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
            });
    };

    const handleCommentEdit = async () => {
        setIsPosting(true);
        setIsEditing(false);

        const body: Pick<NewComment, "content"> = {
            content: commentText,
        };

        axios
            .patch<ResponseData>(
                `/api/blogs/comments/${params.blogId}/${comment.id}`,
                JSON.stringify(body)
            )
            .then(({ data: resData }) => {
                if (resData.code !== 200)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                toast({
                    description: "Comment updated",
                });
            })
            .catch((err) => {
                console.log(err);
                return toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
            })
            .finally(() => {
                setIsPosting(false);
                setIsOpen(false);
                router.refresh();
            });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {["admin", "owner"].includes(user.role) ? (
                <DropdownMenu>
                    <DropdownMenuTrigger className="rounded-md border border-border p-1">
                        <Icons.moreVert className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {comment.parentId === null ? (
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onSelect={handleCommentPin}
                            >
                                {isPinned ? "Unpin" : "Pin"}
                            </DropdownMenuItem>
                        ) : null}
                        {user.id === comment.authorId ? (
                            <DialogTrigger asChild className="cursor-pointer">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                            </DialogTrigger>
                        ) : null}
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={handleCommentDelete}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : user.id === comment.authorId ? (
                <DropdownMenu>
                    <DropdownMenuTrigger className="rounded-md border border-border p-1">
                        <Icons.moreVert className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DialogTrigger asChild className="cursor-pointer">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                        </DialogTrigger>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={handleCommentDelete}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : null}

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Comment</DialogTitle>
                    <DialogDescription>
                        Make changes to your comment & save it to update the
                        comment on the blog
                    </DialogDescription>
                    <div className="pt-3">
                        <TextareaAutosize
                            id="edit_comment"
                            disabled={isPosting || user ? false : true}
                            placeholder="Edit your comment here"
                            value={commentText}
                            className="min-h-[80px] w-full resize-none overflow-hidden rounded-sm border border-gray-700 bg-black px-3 py-2 text-sm focus:border-gray-900 md:text-base"
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                    </div>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        size={"sm"}
                        onClick={handleCommentEdit}
                        disabled={!isEditing}
                        className="flex items-center gap-2"
                    >
                        {isPosting && (
                            <Icons.spinner className="h-4 w-4 animate-spin" />
                        )}
                        Save & Edit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default BlogCommentOperation;

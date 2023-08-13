import { defaultUserPFP } from "@/src/config/const";
import { User } from "@/src/lib/drizzle/schema";
import { cn, convertMstoTimeElapsed } from "@/src/lib/utils";
import { DefaultProps, ExtendedBlog, ExtendedComment } from "@/src/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import BlogCommentOperation from "./blog-comment-operation";
import BlogCommentViewerOperation from "./blog-comment-viewer-operations";

interface PageProps extends DefaultProps {
    blog: ExtendedBlog;
    user: User | null;
    params: {
        blogId: string;
    };
    comment: ExtendedComment;
    allComments: ExtendedComment[];
    isReply: boolean;
}

function RecursiveComment({
    comment,
    user,
    params,
    blog,
    allComments,
    isReply = false,
}: PageProps) {
    const replies = allComments.filter((c) => c.parentId === comment.id);

    return (
        <div className="space-y-5">
            <div className={cn("flex items-start gap-4", isReply && "ml-12")}>
                <Avatar
                    className={cn(
                        isReply
                            ? "h-6 w-6 md:h-8 md:w-8"
                            : "h-8 w-8 md:h-10 md:w-10"
                    )}
                >
                    <AvatarImage
                        src={comment.user.image ?? defaultUserPFP.src}
                        alt={comment.user.name ?? comment.user.id}
                    />
                    <AvatarFallback>
                        {(comment.user.name ?? comment.user.id)
                            .charAt(0)
                            .toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="w-full cursor-default space-y-2">
                    <div className="flex items-center gap-2">
                        <p
                            className={cn(
                                isReply
                                    ? "text-xs md:text-sm"
                                    : "text-sm md:text-base"
                            )}
                        >
                            @{comment.user.name ?? comment.user.id}
                        </p>
                        <p className="text-xs text-gray-500">
                            {convertMstoTimeElapsed(
                                comment.createdAt.getTime()
                            )}
                        </p>
                    </div>
                    <p className="text-sm font-light">
                        {isReply && (
                            <span className="mr-1 rounded-sm bg-gray-800 p-[2px] px-1 text-sm text-gray-300">
                                @
                                {allComments.find(
                                    (c) => c.id === comment.parentId
                                )?.user.name ?? comment.user.id}
                            </span>
                        )}
                        {comment.content}
                    </p>
                    <BlogCommentViewerOperation
                        user={user}
                        params={params}
                        blog={blog}
                        comment={comment}
                    />
                </div>
                {user ? (
                    <BlogCommentOperation
                        user={user}
                        params={params}
                        comment={comment}
                    />
                ) : null}
            </div>
            {replies.length > 0 && (
                <div className="space-y-4">
                    {replies.map((reply) => (
                        <RecursiveComment
                            key={reply.id}
                            comment={reply}
                            user={user}
                            params={params}
                            blog={blog}
                            allComments={allComments}
                            isReply={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default RecursiveComment;

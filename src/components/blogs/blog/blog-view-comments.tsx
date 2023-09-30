import { ClerkUser } from "@/src/lib/validation/user";
import { DefaultProps, ExtendedBlog } from "@/src/types";
import RecursiveComment from "./blog-recursive-comments";

interface PageProps extends DefaultProps {
    blog: ExtendedBlog;
    user: ClerkUser | null;
    params: {
        blogId: string;
    };
}

function BlogViewComments({ className, user, params, blog }: PageProps) {
    const allComments = blog.comments;
    const rootComments = allComments.filter(
        (comment) => !comment.parentId && !comment.pinned
    );
    const pinnedComment = allComments.find((comment) => comment.pinned);

    return (
        <div className={className}>
            {pinnedComment && (
                <RecursiveComment
                    key={pinnedComment.id}
                    comment={pinnedComment}
                    allComments={allComments}
                    user={user}
                    params={params}
                    blog={blog}
                    isReply={false}
                    isPinned={true}
                    id={pinnedComment.id}
                />
            )}
            {rootComments.map((comment) => (
                <RecursiveComment
                    key={comment.id}
                    comment={comment}
                    allComments={allComments}
                    user={user}
                    params={params}
                    blog={blog}
                    isReply={false}
                    isPinned={false}
                    id={comment.id}
                />
            ))}
        </div>
    );
}

export default BlogViewComments;
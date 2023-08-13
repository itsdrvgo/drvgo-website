import { db } from "@/src/lib/drizzle";
import { comments, insertCommentSchema, users } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import {
    CommentContext,
    commentContextSchema,
} from "@/src/lib/validation/route";
import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const replySchema = insertCommentSchema.pick({ content: true });

export async function DELETE(req: NextRequest, context: CommentContext) {
    try {
        const { params } = commentContextSchema.parse(context);

        const authUser = await currentUser();
        if (!authUser)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const user = await db.query.users.findFirst({
            where: eq(users.id, authUser.id),
        });
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized",
            });

        await db
            .delete(comments)
            .where(eq(comments.id, Number(params.commentId)));

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        handleError(err);
    }
}

export async function POST(req: NextRequest, context: CommentContext) {
    const body = await req.json();

    try {
        const { params } = commentContextSchema.parse(context);
        const { content } = replySchema.parse(body);

        const authUser = await currentUser();
        if (!authUser)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const user = await db.query.users.findFirst({
            where: eq(users.id, authUser.id),
        });
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized",
            });

        const newComment = await db.insert(comments).values({
            authorId: user.id,
            blogId: Number(params.blogId),
            content,
            parentId: Number(params.commentId),
        });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(newComment.insertId),
        });
    } catch (err) {
        handleError(err);
    }
}

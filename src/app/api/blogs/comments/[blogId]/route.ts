import { authOptions } from "@/src/lib/auth/auth";
import { db } from "@/src/lib/drizzle";
import { comments, insertCommentSchema, users } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import { BlogContext, blogContextSchema } from "@/src/lib/validation/route";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: BlogContext) {
    const body = await req.json();

    try {
        const { authorId, content } = insertCommentSchema.parse(body);
        const { params } = blogContextSchema.parse(context);

        const session = await getServerSession(authOptions);
        if (!session)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
        });
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized",
            });

        const newComment = await db.insert(comments).values({
            authorId: authorId,
            blogId: Number(params.blogId),
            content: content,
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

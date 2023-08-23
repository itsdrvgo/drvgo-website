import { db } from "@/src/lib/drizzle";
import { images, users } from "@/src/lib/drizzle/schema";
import { currentUser, useAuth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { utapi } from "uploadthing/server";

const f = createUploadthing();

export const customFileRouter = {
    profilePicture: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
        .middleware(async ({ req }) => {
            const authUser = await currentUser();
            if (!authUser) throw new Error("Unauthorized!");

            const user = await db.query.users.findFirst({
                where: eq(users.id, authUser.id),
            });
            if (!user) throw new Error("Unauthorized!");

            if (user.image) {
                const icon = await db.query.images.findFirst({
                    where: and(
                        eq(images.url, user.image),
                        eq(images.uploaderId, user.id)
                    ),
                });

                if (icon) await utapi.deleteFiles(icon.key);
            }

            return { userId: authUser.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            await db.insert(images).values({
                key: file.key,
                uploaderId: metadata.userId,
                url: file.url,
            });
        }),
    blogThumbnail: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
        .middleware(async () => {
            const authUser = await currentUser();
            if (!authUser) throw new Error("Unauthorized!");

            const user = await db.query.users.findFirst({
                where: eq(users.id, authUser.id),
            });
            if (!user || !["owner", "admin"].includes(user.role))
                throw new Error("Unauthorized!");

            return { userId: authUser.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log(metadata, file);
        }),
} satisfies FileRouter;

export type CustomFileRouter = typeof customFileRouter;

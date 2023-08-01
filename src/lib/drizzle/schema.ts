import { InferModel, relations } from "drizzle-orm";
import {
    boolean,
    datetime,
    int,
    longtext,
    mysqlEnum,
    mysqlTable,
    primaryKey,
    text,
    timestamp,
    uniqueIndex,
    varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";

// SCHEMAS

export const users = mysqlTable(
    "users",
    {
        id: varchar("id", { length: 191 }).notNull().primaryKey(),
        name: varchar("name", { length: 191 }),
        email: varchar("email", { length: 191 }).notNull(),
        emailVerified: timestamp("email_verified"),
        image: varchar("image", { length: 191 }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
        role: mysqlEnum("role", ["user", "moderator", "admin", "owner"])
            .default("user")
            .notNull(),
    },
    (user) => ({
        emailIndex: uniqueIndex("email_idx").on(user.email),
    })
);

export const accounts = mysqlTable(
    "accounts",
    {
        id: varchar("id", { length: 191 }).notNull().primaryKey(),
        userId: varchar("user_id", { length: 191 }).notNull(),
        type: varchar("type", { length: 191 }).notNull(),
        provider: varchar("provider", { length: 191 }).notNull(),
        providerAccountId: varchar("provider_account_id", {
            length: 191,
        }).notNull(),
        refreshToken: text("refresh_token"),
        accessToken: text("access_token"),
        expiresAt: int("expires_at"),
        tokenType: varchar("token_type", { length: 191 }),
        scope: varchar("scope", { length: 191 }),
        idToken: text("id_token"),
        sessionState: varchar("session_state", { length: 191 }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
    },
    (account) => ({
        providerIndex: uniqueIndex("provider_idx").on(
            account.provider,
            account.providerAccountId
        ),
    })
);

export const sessions = mysqlTable("sessions", {
    userId: varchar("user_id", { length: 191 }).notNull(),
    expires: datetime("expires").notNull(),
    sessionToken: varchar("session_token", { length: 191 })
        .notNull()
        .primaryKey(),
});

export const verificationTokens = mysqlTable(
    "verification_tokens",
    {
        identifier: varchar("identifier", { length: 191 }).notNull(),
        token: varchar("token", { length: 191 }).notNull(),
        expires: datetime("expires").notNull(),
    },
    (request) => ({
        identifierTokenIndex: uniqueIndex("identifier_token_idx").on(
            request.identifier,
            request.token
        ),
    })
);

export const images = mysqlTable("images", {
    id: int("id").autoincrement().primaryKey(),
    key: varchar("key", { length: 255 }).notNull(),
    url: varchar("url", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    uploaderId: varchar("uploaderId", { length: 255 }).notNull(),
});

export const blogs = mysqlTable("blogs", {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    thumbnailUrl: varchar("thumbnailUrl", { length: 255 }),
    content: longtext("content"),
    published: boolean("published").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at"),
    authorId: varchar("authorId", { length: 255 }).notNull(),
});

export const views = mysqlTable("views", {
    id: int("id").autoincrement().primaryKey(),
    blogId: int("blogId").notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
});

export const likes = mysqlTable("likes", {
    id: int("id").autoincrement().primaryKey(),
    blogId: int("blogId").notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
});

export const comments = mysqlTable("comments", {
    id: int("id").autoincrement().primaryKey(),
    blogId: int("blogId").notNull(),
    content: text("text").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    authorId: varchar("authorId", { length: 255 }).notNull(),
});

// RELATIONS

export const usersRelations = relations(users, ({ many }) => ({
    views: many(views),
    likes: many(likes),
    blogs: many(blogs),
    comments: many(comments),
    images: many(images),
    accounts: many(accounts),
    sessions: many(sessions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
    }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

export const imageRelations = relations(images, ({ one }) => ({
    user: one(users, {
        fields: [images.uploaderId],
        references: [users.id],
    }),
}));

export const blogsRelations = relations(blogs, ({ one, many }) => ({
    author: one(users, {
        fields: [blogs.authorId],
        references: [users.id],
    }),
    likes: many(likes),
    comments: many(comments),
    views: many(views),
}));

export const viewRelations = relations(views, ({ one }) => ({
    blog: one(blogs, {
        fields: [views.blogId],
        references: [blogs.id],
    }),
    user: one(users, {
        fields: [views.userId],
        references: [users.id],
    }),
}));

export const likeRelations = relations(likes, ({ one }) => ({
    blog: one(blogs, {
        fields: [likes.blogId],
        references: [blogs.id],
    }),
    user: one(users, {
        fields: [likes.userId],
        references: [users.id],
    }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
    blog: one(blogs, {
        fields: [comments.blogId],
        references: [blogs.id],
    }),
    user: one(users, {
        fields: [comments.authorId],
        references: [users.id],
    }),
}));

// TYPES

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, "insert">;

export type Blog = InferModel<typeof blogs>;
export type NewBlog = InferModel<typeof blogs, "insert">;

export type View = InferModel<typeof views>;
export type NewView = InferModel<typeof views, "insert">;

export type Like = InferModel<typeof likes>;
export type NewLike = InferModel<typeof likes, "insert">;

export type Comment = InferModel<typeof comments>;
export type NewComment = InferModel<typeof comments, "insert">;

// ZOD SCHEMA

export const insertUserSchema = createInsertSchema(users);

export const insertBlogSchema = createInsertSchema(blogs);

export const insertViewSchema = createInsertSchema(views);

export const insertLikeSchema = createInsertSchema(likes);

export const insertCommentSchema = createInsertSchema(comments);

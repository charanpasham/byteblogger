import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `byteblogger_${name}`);

export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),
  role: d.varchar({ length: 255 }).notNull().default("user"),
}));

export const roles = createTable("role", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }).notNull().unique(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("t_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    title: d.varchar({ length: 256 }).notNull(),
    description: d
      .varchar({ length: 512 })
      .$type<string | null>()
      .default(null),
    content: d.text().$type<string | null>().default(null),
    slug: d.varchar({ length: 256 }).notNull().unique(),
    isPublished: d.boolean().notNull().default(false),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "set default" })
      .default("0"),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
    publishedAt: d
      .timestamp({ withTimezone: true })
      .$type<Date | null>()
      .default(null),
    isPinned: d.boolean().notNull().default(false),
    pinnedOrder: d.integer().$type<number | null>().default(null),
    viewCount: d.integer().notNull().default(0),
  }),
  (t) => [index("created_by_idx").on(t.userId), index("slug_idx").on(t.slug)],
);

export const posttags = createTable(
  "post_tags",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 100 }).notNull().unique(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [index("post_tags_name_idx").on(t.name)],
);

export const posttagmapping = createTable(
  "post_tag_mapping",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    postId: d
      .integer()
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: d
      .integer()
      .notNull()
      .references(() => posttags.id, { onDelete: "cascade" }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("post_tag_mapping_post_id_idx").on(t.postId),
    index("post_tag_mapping_tag_id_idx").on(t.tagId),
  ],
);

export const postLikes = createTable(
  "post_likes",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    postId: d
      .integer()
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "set default" })
      .default("0"),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("post_likes_post_id_idx").on(t.postId),
    index("post_likes_user_id_idx").on(t.userId),
  ],
);

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  post: one(posts, { fields: [postLikes.postId], references: [posts.id] }),
  user: one(users, { fields: [postLikes.userId], references: [users.id] }),
}));


export const postsRelations = relations(posts, ({ many, one }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  post_likes: many(postLikes),
}));

export const comments = createTable("comments", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  content: d.text().notNull(),
  postId: d
    .integer()
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "set default" })
    .default("0"),
  // parentCommentId: d
  //   .integer()
  //   .$type<number | null>()
  //   .references((): number => comments.id)
  //   .default(null),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ withTimezone: true })
    .$onUpdate(() => new Date())
    .default(sql`CURRENT_TIMESTAMP`),
  IsDeleted: d.boolean().notNull().default(false),
  IsEdited: d.boolean().notNull().default(false),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  // parentComment: one(comments, {
  //   fields: [comments.parentCommentId],
  //   references: [comments.id],
  // }),
}));

export const commentLikes = createTable(
  "comment_likes",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    commentId: d
      .integer()
      .notNull()
      .references(() => comments.id, { onDelete: "cascade" }),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "set default" })
      .default("0"),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("comment_likes_comment_id_idx").on(t.commentId),
    index("comment_likes_user_id_idx").on(t.userId),
  ],
);

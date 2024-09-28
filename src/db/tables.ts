import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique(),
  passwordhash: text("password").notNull(),
  salt: text("salt").notNull(),
  email: text("email").unique(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdateFn(() => new Date().toISOString().replace("T", " ").slice(0, -5)),
});

export const todosTable = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  authorId: integer("author_id").references(() => usersTable.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdateFn(() => new Date().toISOString().replace("T", " ").slice(0, -5)),
});

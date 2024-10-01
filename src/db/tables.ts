import { SQLiteSessionTable } from "@lucia-auth/adapter-drizzle";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique(),
  password: text("password").notNull(), // stored as the hash
  salt: text("salt").notNull(),
  // email: text("email").unique(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`)
    .$onUpdateFn(() => new Date()),
});

export type SelectUsers = typeof usersTable.$inferSelect
export type InsertUsers = typeof usersTable.$inferInsert

export const sessionsTable = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => usersTable.id),
  expiresAt: integer("expires_at").notNull(),
}) 

export type SelectSessions = typeof sessionsTable.$inferSelect
export type InsertSessions = typeof sessionsTable.$inferInsert

export const todosTable = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  authorId: integer("author_id")
    .notNull()
    .references(() => usersTable.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`)
    .$onUpdateFn(() => new Date()),
});

export type SelectTodos = typeof todosTable.$inferSelect
export type InsertTodos = typeof todosTable.$inferInsert
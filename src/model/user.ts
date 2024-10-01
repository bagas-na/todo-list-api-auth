import { eq } from "drizzle-orm";
import db from "../db/db";
import { InsertUser, SelectUser, usersTable } from "../db/tables";

export async function getUser(username: string): Promise<SelectUser | null> {
  const result = await db.select().from(usersTable).where(eq(usersTable.username, username));

  if (!result || result.length === 0 || !result[0]) {
    return null;
  }

  return result[0];
}

export async function insertUser(newUser: InsertUser): Promise<SelectUser | null> {
  const result = await db.insert(usersTable).values(newUser).returning()

  if (!result || result.length === 0 || !result[0]) {
    return null;
  }

  return result[0];
}
import { eq } from "drizzle-orm";
import db from "../db/db";
import { InsertUser, SelectUser, usersTable } from "../db/tables";

export async function getUser(username: string): Promise<SelectUser | null> {
  try {
    const result = await db.select().from(usersTable).where(eq(usersTable.username, username));

    if (!result || result.length === 0 || !result[0]) {
      return null;
    }

    return result[0];
  } catch (e) {
    console.error("Error fetching user from database:", e);
    return null;
  }
}

export async function insertUser(newUser: InsertUser): Promise<SelectUser | null> {
  try {
    const result = await db.insert(usersTable).values(newUser).returning();

    if (!result || result.length === 0 || !result[0]) {
      return null;
    }

    return result[0];
  } catch (e) {
    console.error("Error inserting user into database:", e);
    return null;
  }
}

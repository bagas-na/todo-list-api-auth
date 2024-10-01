import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import type { Env } from "hono";
import type { Session, User } from "lucia";
import { Lucia } from "lucia";
import db from "./db";
import { SelectUser, sessionsTable, usersTable } from "./tables";

export interface Context extends Env {
  Variables: {
    user: User | null;
    session: Session | null;
  };
}

const adapter = new DrizzleSQLiteAdapter(db, sessionsTable, usersTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    UserId: number;
    DatabaseUserAttributes: SelectUser;
  }
}
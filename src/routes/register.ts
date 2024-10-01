import { Hono } from "hono";
import { generateIdFromEntropySize } from "lucia";
import { lucia } from "../db/lucia";
import { insertUser } from "../model/user";
import { hashPassword } from "../utils/password";

const register = new Hono();

register.get("/", (c) => c.text("Register Attempt"));

register.post("/", async (c) => {
  let username = "";
  let password = "";
  const contentType = c.req.header("Content-Type");

  if (!contentType) {
    return new Response("Invalid Content-type. Supports application/json and multipart/form-data", {
      status: 400,
    });
  }

  if (contentType.includes("application/json")) {
    const json = await c.req.json<{ username: string; password: string }>();
    username = json.username;
    password = json.password;
  } else if (contentType.includes("multipart/form-data")) {
    const request = await c.req.formData();
    // To do, form validation using zod
    username = String(request.get("username"));
    password = String(request.get("password"));
  }

  const salt = generateIdFromEntropySize(10); // 16 characters long
  const passwordHash = await hashPassword(password, salt);

  try {
    const insertedUser = await insertUser({ username, passwordHash, salt });

    if (insertedUser === null) {
      return new Response("Failed to register user", {
        status: 500,
      });
    }

    const userId = insertedUser.id;

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
        "Set-Cookie": sessionCookie.serialize(),
      },
    });
  } catch {
    // db error, email taken, etc
    return new Response("Username already used", {
      status: 400,
    });
  }
});

export default register;

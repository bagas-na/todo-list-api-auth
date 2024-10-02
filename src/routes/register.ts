import crypto from "crypto";
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
    console.log(JSON.stringify({contentType}))
    const json = await c.req.json<{ username: string; password: string }>();
    console.log(JSON.stringify({json}))
    // To do, form validation using zod
    if (!json || typeof json.username !== "string" || typeof json.password !== "string") {
      return new Response("Invalid username or pasword", {
        status: 400,
      });
    }

    username = json.username;
    password = json.password;
  } else if (contentType.includes("multipart/form-data")) {
    console.log(JSON.stringify({contentType}))
    const request = await c.req.formData();
    console.log(JSON.stringify({request}))
    // To do, form validation using zod
    const usernameValue = request.get("username");
    const passwordValue = request.get("password");
    if (typeof usernameValue !== "string" || typeof passwordValue !== "string") {
      return new Response("Invalid username or password", {
        status: 400,
      });
    }
    username = usernameValue;
    password = passwordValue;
  }

  const salt = crypto.randomBytes(64).toString('base64')
  console.log(JSON.stringify({salt}))
  const passwordHash = await hashPassword(password, salt);

  try {
    console.log(`Inserting userdata: ${JSON.stringify({username, passwordHash, salt})}`)
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
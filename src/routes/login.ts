import { Context, Hono } from "hono";
import { lucia } from "../db/lucia";
import { getUser } from "../model/user";
import { verifyPassword } from "../utils/password";

const login = new Hono();

login.get("/", (c) => c.text("Login attempt"));

login.post("/login", async (c: Context) => {
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

    // To do, form validation using zod
    if (!json || typeof json.username !== "string" || typeof json.password !== "string") {
      return new Response("Invalid username or pasword", {
        status: 400,
      });
    }

    username = json.username;
    password = json.password;
  } else if (contentType.includes("multipart/form-data")) {
    const request = await c.req.formData();

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
  
	const user = await getUser(username)

	if (user === null) {
		// NOTE:
		// Returning immediately allows malicious actors to figure out valid emails from response times,
		// allowing them to only focus on guessing passwords in brute-force attacks.
		// As a preventive measure, you may want to hash passwords even for invalid emails.
		// However, valid emails can be already be revealed with the signup page
		// and a similar timing issue can likely be found in password reset implementation.
		// It will also be much more resource intensive.
		// Since protecting against this is non-trivial,
		// it is crucial your implementation is protected against brute-force attacks with login throttling etc.
		// If emails/usernames are public, you may outright tell the user that the username is invalid.
		return new Response("Invalid email or password", {
			status: 400
		});
	}

	const validPassword = await verifyPassword(password, user.salt, user.passwordHash);
	if (!validPassword) {
		return new Response("Invalid email or password", {
			status: 400
		});
	}

	const session = await lucia.createSession(user.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/",
			"Set-Cookie": sessionCookie.serialize()
		}
	});
});

export default login;
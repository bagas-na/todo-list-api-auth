import { Hono } from "hono";

const login = new Hono();

login.post("/", (c) => c.text("Login attempt"));

export default login;
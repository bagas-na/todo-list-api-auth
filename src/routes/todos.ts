import { Hono } from "hono";

const todos = new Hono();

todos.get("/", (c) => c.text('List of books'));

export default todos
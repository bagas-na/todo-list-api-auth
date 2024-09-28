import { Hono } from "hono";

const register = new Hono();

register.post('/', (c) => c.text("Register Attempt"))

export default register;
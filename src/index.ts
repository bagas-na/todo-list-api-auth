import { Hono } from 'hono'
import loginRouter from "./routes/login"
import registerRouter from "./routes/register"
import todosRouter from "./routes/todos"

const app = new Hono()

app.route("/login", loginRouter)
app.route("/register", registerRouter)
app.route("todos", todosRouter)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
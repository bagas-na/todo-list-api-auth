import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  schema: "./src/db/tables.ts",
  dialect: 'sqlite',
  out: "./drizzle",
  dbCredentials: {
    url: "file:./data/todo.sqlite",
  },
})
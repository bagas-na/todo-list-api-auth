import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';

const sqlite = new Database('./data/todo.sqlite');
const db = drizzle(sqlite);

export default db
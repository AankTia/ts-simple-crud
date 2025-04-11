import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

let db: Database;

export async function connectDb() {
    db = await open({
        filename: "./database.sqlite",
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PROMARU KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log("Database connected an initialized");
    return db;
}

export function getDb() {
    if (!db) {
        throw new Error("Database no initialized. Call connectDb first.");
    }
    return db;
}

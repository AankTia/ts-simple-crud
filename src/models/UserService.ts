import { getDb } from "../db/database";
import { User, UserInput } from "./User";

export async function getAllUsers(): Promise<User[]> {
    const db = getDb();
    return await db.all("SELECT * FROM users ORDER BY created_at DESC");
}

export async function getUserById(id: number): Promise<User | undefined> {
    const db = getDb();
    return await db.get("SELECT * FROM users WHERE id = ?", id);
}

export async function createUser(user:UserInput): Promise<User> {
    const db = getDb();
    const result = await db.run(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        user.name,
        user.email
    );

    return {
        id: result.lastID,
        ...user,
    };
}

export async function updateUser(id: number, user: UserInput): Promise<User | undefined> {
    const db = getDb();
    await db.run(
        "UPDATE users SET name = ?, email = ? WHERE id = ?",
        user.name,
        user.email,
        id
    );

    return await getUserById(id);
}

// export async function deleteUser(id: number): Promise<boolean> {
//     const db = getDb();
//     const result = await db.run("DELETE FROM users, WHERE id = ?", id);
//     return result.changes > 0;
// }
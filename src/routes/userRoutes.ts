import express, { Request, Response } from "express";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../models/UserService";
import { UserInput } from "../models/User";

const router = express.Router();

// Get all users
router.get("/", async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({ error: "Failed to retrieve users" });
    }
});

// Get user by ID
router.get("/:id", async (req: Request, res: Response): Promise<any> => {
    try {
        const id = parseInt(req.params.id);
        const user = await getUserById(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({ error: "Failed to retrieve user" });
    }
});

// Create new user
router.post("/", async (req: Request, res: Response): Promise<any> => {
    try {
        const userInput: UserInput = req.body;

        if (!userInput.name || !userInput.email) {
            return res.status(400).json({ error: "Name and email are required" });
        }

        const newUser = await createUser(userInput);
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);

        // Check for unique constraint violation (email already exists)
        if (error.message?.includes("UNIQUE constraint failed")) {
            return res.status(409).json({ error: "Email already exists" });
        }

        res.status(500).json({ error: "Failed to create user" });
    }
});

// Update user
router.put("/:id", async (req: Request, res: Response): Promise<any> => {
    try {
        const id = parseInt(req.params.id);
        const userInput: UserInput = req.body;

        if (!userInput.name || !userInput.email) {
            return res.status(400).json({ error: "Name and email are required" });
        }

        const user = await updateUser(id, userInput);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error updating user:", error);

        if (error.message?.includes("UNIQUE constraint failed")) {
            return res.status(409).json({ error: "Email already exists" });
        }

        res.status(500).json({ error: "Failed to update user" });
    }
});

// Delete user
router.delete("/:id", async (req: Request, res: Response): Promise<any> => {
    try {
        const id = parseInt(req.params.id);
        const success = await deleteUser(id);

        if (!success) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(204).end();
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

export default router;
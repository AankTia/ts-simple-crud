import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { connectDb } from "./db/database";
import userRoutes from "./routes/userRoutes";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/users", userRoutes);

// Serve the frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
async function startServer() {
    try {
        await connectDb();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
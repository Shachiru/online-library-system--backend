import express, {Express} from "express";
import cors from "cors";
import bookRoutes from "./routes/book.routes";
import authRoutes from "./routes/auth.routes";
import borrowingBookRoutes from "./routes/borrowingList.routes";
import transactionRoutes from "./routes/transaction.routes";
import {authenticateToken} from "./middleware/auth.middleware";
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();

app.use(express.json());

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://localhost:5173",
];

const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        console.log("CORS Origin:", origin);
        if (allowedOrigins.includes(origin!) || !origin) {
            callback(null, true);
        } else {
            callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/books", authenticateToken, bookRoutes);
app.use("/api/borrowing-list", authenticateToken, borrowingBookRoutes);
app.use("/api/transactions", authenticateToken, transactionRoutes);

export default app;
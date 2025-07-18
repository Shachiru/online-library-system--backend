import express, {Express} from "express";
import cors from "cors";
import bookRoutes from "./routes/book.routes";

const app: Express = express();

app.use(express.json());

const allowedOrigins = [
    "http://localhost:5173"
];

const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}

app.use(cors(corsOptions));

app.use("/api/books", bookRoutes);

export default app;
import express, {Express} from "express";
import cors from "cors";

const app: Express = express();

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

export default app;
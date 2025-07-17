import express, {Express} from "express";

const app: Express = express();

const allowedOrigins = [
    "http://localhost:5173"
];

export default app;
import { Router } from "express";
import {borrowBooks, returnBooks} from "../controllers/transaction.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const transactionRoutes: Router = Router();

transactionRoutes.post("/borrow", authenticateToken, borrowBooks);
transactionRoutes.post("/return", authenticateToken, returnBooks)

export default transactionRoutes;
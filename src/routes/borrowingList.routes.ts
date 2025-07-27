import {Router} from "express";
import * as borrowingListController from "../controllers/borrowingList.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const borrowingBookRoutes: Router = Router();

borrowingBookRoutes.get("/", authenticateToken, borrowingListController.getBorrowingList);

borrowingBookRoutes.post("/add", authenticateToken, borrowingListController.addToBorrowingList);

borrowingBookRoutes.delete("/remove/:isbn", authenticateToken, borrowingListController.removeFromBorrowingList);

borrowingBookRoutes.delete("/clear", authenticateToken, borrowingListController.clearBorrowingList);

export default borrowingBookRoutes;
import {Router} from "express";
import {
    getBorrowingList,
    addToBorrowingList,
    removeFromBorrowingList,
    clearBorrowingList,
} from "../controllers/borrowingList.controller";
import {authenticateToken} from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticateToken, getBorrowingList);
router.post("/add", authenticateToken, addToBorrowingList);
router.delete("/remove/:isbn", authenticateToken, removeFromBorrowingList);
router.delete("/clear", authenticateToken, clearBorrowingList);

export default router;
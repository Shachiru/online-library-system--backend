import { Router } from "express";
import { login, register, refresh, logout } from "../controllers/auth.controller";

const authRouter: Router = Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/refresh-token", refresh); // Changed refreshToken to refresh
authRouter.post("/logout", logout);

export default authRouter;
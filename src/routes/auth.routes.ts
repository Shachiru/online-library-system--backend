import {Router} from "express";
import {register, login, getUser, updateUser, deleteUser, logout} from "../controllers/auth.controller";

const authRoutes: Router = Router();

authRoutes.post("/register", register);

authRoutes.post("/login", login);

authRoutes.get("/:id", getUser);

authRoutes.put("/update/:id", updateUser);

authRoutes.delete("//delete/:id", deleteUser);

authRoutes.post("/logout", logout);

export default authRoutes;
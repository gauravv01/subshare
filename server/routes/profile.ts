import { Router , Request, Response } from "express";
import { getUser } from "../middleware/user";
import { getProfile, updateProfile } from "../services/profile";

const router = Router();

router.get("/profile", getUser, getProfile);

router.put("/profile", getUser, updateProfile);


export default router;
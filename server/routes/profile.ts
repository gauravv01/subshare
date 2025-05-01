import { Router , Request, Response } from "express";
import { getUser } from "../middleware/user";
import { getProfile, updateProfile, updateOtherProfile } from "../services/profile";

const router = Router();

router.get("/profile", getUser, getProfile);

router.put("/profile", getUser, updateProfile);

router.put("/other-profile/:id", getUser, updateOtherProfile);

export default router;
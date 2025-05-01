import { Router } from "express";
import { getAdminDashboardStats, getRecentUsers, getPopularServices, getServiceCounts, getUserCounts } from "../services/admin";
import { getUser } from "../middleware/user";

const router = Router();

router.get("/dashboard/stats", getUser, getAdminDashboardStats);
router.get("/dashboard/recent-users", getUser, getRecentUsers);
router.get("/dashboard/popular-services", getUser, getPopularServices);
router.get("/dashboard/service-counts", getUser, getServiceCounts);
router.get("/dashboard/user-counts", getUser, getUserCounts);

export default router;
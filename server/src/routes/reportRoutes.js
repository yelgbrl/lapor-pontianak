import { Router } from "express";
import {
  createReport,
  getMyReports,
  getReportById,
  getAllReports,
  updateReportStatus,
  trackReport,
} from "../controllers/reportController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = Router();

// Endpoint publik: tidak membutuhkan autentikasi.
router.get("/track/:trackingCode", trackReport);

// Semua endpoint berikutnya wajib melewati autentikasi.
router.use(authMiddleware);

// Endpoint khusus admin.
router.get("/all", roleMiddleware("ADMIN"), getAllReports);
router.patch("/:id/status", roleMiddleware("ADMIN"), updateReportStatus);

// Endpoint pengguna.
router.post("/", createReport);
router.get("/my", getMyReports);
router.get("/:id", getReportById);

export default router;

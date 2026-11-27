// Mengimpor Router dari Express.
import { Router } from "express";

// Mengimpor controller kategori.
import {
  getCategories,
  createCategory,
} from "../controllers/categoryController.js";

// Mengimpor middleware autentikasi dan otorisasi.
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

// Membuat router kategori.
const router = Router();

// Endpoint untuk mengambil seluruh kategori.
router.get("/", getCategories);

// Endpoint untuk menambahkan kategori khusus ADMIN.
router.post("/", authMiddleware, roleMiddleware("ADMIN"), createCategory);

// Mengekspor router.
export default router;

// Mengimpor Router dari Express.
import { Router } from "express";

// Mengimpor controller health check.
import { checkHealth } from "../controllers/healthController.js";

// Membuat router untuk health check.
const router = Router();

// Menentukan endpoint GET untuk pemeriksaan kesehatan API.
router.get("/", checkHealth);

// Mengekspor router agar dapat digunakan server.
export default router;

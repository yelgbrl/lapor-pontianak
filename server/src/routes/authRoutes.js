// Mengimpor Router dari Express.
import { Router } from "express";

// Mengimpor controller autentikasi.
import {
  register,
  login,
  getMe,
} from "../controllers/authController.js";

// Mengimpor middleware autentikasi.
import authMiddleware from "../middlewares/authMiddleware.js";

// Membuat router autentikasi.
const router = Router();

// Endpoint registrasi.
router.post("/register", register);

// Endpoint login.
router.post("/login", login);

// Endpoint profil yang memerlukan token JWT.
router.get("/me", authMiddleware, getMe);

// Mengekspor router.
export default router;

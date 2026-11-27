// Mengimpor library JWT untuk memverifikasi token.
import jwt from "jsonwebtoken";

// Middleware untuk memeriksa autentikasi pengguna.
const authMiddleware = (req, res, next) => {
  // Mengambil token dari header Authorization.
  const authHeader = req.headers.authorization;

  // Memeriksa apakah token tersedia dan menggunakan format Bearer.
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Akses ditolak. Token autentikasi tidak ditemukan.",
    });
  }

  // Mengambil nilai token tanpa awalan Bearer.
  const token = authHeader.split(" ")[1];

  try {
    // Memverifikasi token menggunakan secret JWT.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Menyimpan informasi pengguna agar dapat digunakan controller.
    req.user = decoded;

    // Melanjutkan request ke middleware atau controller berikutnya.
    next();
  } catch (error) {
    // Menolak request jika token tidak valid atau sudah kedaluwarsa.
    return res.status(401).json({
      success: false,
      message: "Token tidak valid atau sudah kedaluwarsa.",
    });
  }
};

// Mengekspor middleware agar dapat digunakan pada route.
export default authMiddleware;

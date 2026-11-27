// Middleware untuk membatasi akses berdasarkan role pengguna.
const roleMiddleware = (...allowedRoles) => {
  // Mengembalikan middleware untuk memeriksa role.
  return (req, res, next) => {
    // Memastikan pengguna sudah melewati autentikasi.
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Autentikasi diperlukan.",
      });
    }

    // Memeriksa apakah role pengguna diizinkan.
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki izin untuk mengakses fitur ini.",
      });
    }

    // Melanjutkan request jika role diizinkan.
    next();
  };
};

// Mengekspor middleware agar dapat digunakan pada route.
export default roleMiddleware;

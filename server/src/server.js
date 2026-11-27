// Mengimpor route kategori laporan.
import categoryRoutes from "./routes/categoryRoutes.js";

// Mengimpor route autentikasi pengguna.
import authRoutes from "./routes/authRoutes.js";

// Mengimpor route untuk pemeriksaan kesehatan API.
import healthRoutes from "./routes/healthRoutes.js";

// Memuat environment variables dari file .env.
import "dotenv/config";

// Mengimpor Express untuk membangun server dan API.
import express from "express";

// Mengimpor route laporan kerusakan.
import reportRoutes from "./routes/reportRoutes.js";

// Mengimpor CORS agar frontend dapat mengakses backend.
import cors from "cors";

// Mengimpor Prisma Client untuk mengakses database.
import prisma from "./config/prisma.js";

// Membuat aplikasi Express.
const app = express();

// Menentukan port server.
const PORT = process.env.PORT || 5000;

// Mengaktifkan middleware CORS.
app.use(cors());

// Mengizinkan server membaca request dalam format JSON.
app.use(express.json());

// Menghubungkan route health check dengan prefix API.
app.use("/api/health", healthRoutes);

// Menghubungkan endpoint autentikasi dengan prefix API.
app.use("/api/auth", authRoutes);

// Menghubungkan route kategori dengan prefix API.
app.use("/api/categories", categoryRoutes);

// Menghubungkan route laporan dengan prefix API.
app.use("/api/reports", reportRoutes);

// Endpoint untuk memeriksa status backend.
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Lapor! Pontianak API is running!",
  });
});

// Menjalankan server setelah koneksi database berhasil.
const startServer = async () => {
  try {
    await prisma.$connect();

    console.log("Koneksi database berhasil!");

    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Gagal menghubungkan database:", error);
    process.exit(1);
  }
};

// Memulai server.
startServer();

// Mengimpor Prisma Client untuk mengakses database.
import prisma from "../config/prisma.js";

// Memeriksa kesehatan backend dan koneksi database.
export const checkHealth = async (req, res) => {
  try {
    // Menjalankan query sederhana untuk menguji koneksi database.
    await prisma.$queryRaw`SELECT 1`;

    // Mengirim respons jika backend dan database berjalan.
    res.status(200).json({
      success: true,
      message: "API dan database berjalan dengan baik.",
    });
  } catch (error) {
    // Mengirim respons jika pemeriksaan database gagal.
    res.status(500).json({
      success: false,
      message: "Koneksi database bermasalah.",
    });
  }
};

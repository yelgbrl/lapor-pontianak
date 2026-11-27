// Mengimpor Prisma Client untuk mengakses database.
import prisma from "../config/prisma.js";

// Controller untuk mengambil seluruh kategori laporan.
export const getCategories = async (req, res) => {
  try {
    // Mengambil seluruh kategori dan mengurutkannya berdasarkan nama.
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    // Mengirim daftar kategori kepada pengguna.
    return res.status(200).json({
      success: true,
      message: "Daftar kategori berhasil ditemukan.",
      data: categories,
    });
  } catch (error) {
    // Menampilkan kesalahan pada terminal server.
    console.error("Kesalahan mengambil kategori:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
};

// Controller untuk menambahkan kategori baru.
export const createCategory = async (req, res) => {
  try {
    // Mengambil nama dan deskripsi kategori dari request body.
    const { name, description } = req.body;

    // Memeriksa apakah nama kategori sudah diisi.
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Nama kategori wajib diisi.",
      });
    }

    // Memeriksa apakah kategori sudah terdaftar.
    const existingCategory = await prisma.category.findUnique({
      where: {
        name: name.trim(),
      },
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Kategori sudah tersedia.",
      });
    }

    // Menyimpan kategori baru ke database.
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
    });

    // Mengirim respons setelah kategori berhasil dibuat.
    return res.status(201).json({
      success: true,
      message: "Kategori berhasil ditambahkan.",
      data: category,
    });
  } catch (error) {
    // Menampilkan kesalahan pada terminal server.
    console.error("Kesalahan menambahkan kategori:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
};

// Mengimpor Prisma Client untuk mengakses database.
import prisma from "../config/prisma.js";

// Controller untuk membuat laporan baru.
export const createReport = async (req, res) => {
  try {
    // Mengambil data laporan dari request body.
    const { title, description, location, categoryId, photoUrl } = req.body;

    // Memeriksa kelengkapan data laporan.
    if (!title || !description || !location || !categoryId || !photoUrl) {
      return res.status(400).json({
        success: false,
        message: "Semua data laporan wajib diisi.",
      });
    }

    // Memeriksa apakah kategori tersedia di database.
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Kategori laporan tidak ditemukan.",
      });
    }

    // Membuat kode pelacakan unik untuk laporan.
    const trackingCode = `LPR-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()}`;

    // Menyimpan laporan baru ke database.
    const report = await prisma.report.create({
      data: {
        trackingCode,
        title,
        description,
        location,
        photoUrl,
        userId: req.user.id,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    // Mengirim respons setelah laporan berhasil dibuat.
    return res.status(201).json({
      success: true,
      message: "Laporan berhasil dikirim.",
      data: report,
    });
  } catch (error) {
    console.error("Kesalahan membuat laporan:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
};

// Controller untuk mengambil laporan milik pengguna yang login.
export const getMyReports = async (req, res) => {
  try {
    // Mengambil laporan berdasarkan ID pengguna.
    const reports = await prisma.report.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Mengirim daftar laporan pengguna.
    return res.status(200).json({
      success: true,
      message: "Daftar laporan berhasil ditemukan.",
      data: reports,
    });
  } catch (error) {
    console.error("Kesalahan mengambil laporan:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
};
// Controller untuk mengambil detail laporan.
export const getReportById = async (req, res) => {
  try {
    // Mengambil ID laporan dari parameter URL.
    const { id } = req.params;

    // Mencari laporan berdasarkan ID.
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Memeriksa apakah laporan ditemukan.
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Laporan tidak ditemukan.",
      });
    }

    // Memastikan USER hanya dapat melihat laporan miliknya.
    if (req.user.role !== "ADMIN" && report.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki izin untuk melihat laporan ini.",
      });
    }

    // Mengirim detail laporan.
    return res.status(200).json({
      success: true,
      message: "Detail laporan berhasil ditemukan.",
      data: report,
    });
  } catch (error) {
    console.error("Kesalahan mengambil detail laporan:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
};
// Controller untuk mengambil seluruh laporan warga (khusus admin).
export const getAllReports = async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Seluruh laporan berhasil ditemukan.",
      data: reports,
    });
  } catch (error) {
    console.error("Kesalahan mengambil seluruh laporan:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
};
// Controller untuk memperbarui status laporan (khusus admin).
export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, handlingNote } = req.body;

    // Daftar status yang diperbolehkan.
    const allowedStatuses = [
      "PENDING",
      "IN_PROGRESS",
      "COMPLETED",
      "REJECTED",
    ];

    // Memastikan status yang dikirim valid.
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status laporan tidak valid.",
      });
    }

    // Memastikan laporan tersedia.
    const existingReport = await prisma.report.findUnique({
      where: { id },
    });

    if (!existingReport) {
      return res.status(404).json({
        success: false,
        message: "Laporan tidak ditemukan.",
      });
    }

    // Memperbarui status dan catatan penanganan.
    const updatedReport = await prisma.report.update({
      where: { id },
      data: {
        status,
        handlingNote,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Status laporan berhasil diperbarui.",
      data: updatedReport,
    });
  } catch (error) {
    console.error("Kesalahan memperbarui status laporan:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
};
// Controller publik untuk melacak laporan menggunakan tracking code.
export const trackReport = async (req, res) => {
  try {
    const { trackingCode } = req.params;

    // Mencari laporan berdasarkan kode pelacakan.
    const report = await prisma.report.findUnique({
      where: { trackingCode },
      include: {
        category: true,
      },
    });

    // Mengembalikan 404 jika kode pelacakan tidak ditemukan.
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Laporan dengan kode pelacakan tersebut tidak ditemukan.",
      });
    }

    // Hanya mengirim informasi yang aman untuk ditampilkan kepada publik.
    return res.status(200).json({
      success: true,
      message: "Laporan berhasil ditemukan.",
      data: {
        trackingCode: report.trackingCode,
        title: report.title,
        description: report.description,
        location: report.location,
        status: report.status,
        handlingNote: report.handlingNote,
        category: report.category.name,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
      },
    });
  } catch (error) {
    console.error("Kesalahan melacak laporan:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
};

// Mengimpor Prisma Client untuk mengakses database.
import prisma from "../config/prisma.js";

// Mengimpor bcrypt untuk mengenkripsi dan memeriksa password.
import bcrypt from "bcryptjs";

// Mengimpor JWT untuk membuat token autentikasi.
import jwt from "jsonwebtoken";

// Controller untuk mendaftarkan pengguna baru.
export const register = async (req, res) => {
  try {
    // Mengambil data dari request body.
    const { name, email, password } = req.body;

    // Memeriksa kelengkapan data registrasi.
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, dan password wajib diisi.",
      });
    }

    // Memeriksa panjang minimum password.
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password minimal 8 karakter.",
      });
    }

    // Memeriksa apakah email sudah terdaftar.
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email sudah terdaftar.",
      });
    }

    // Mengenkripsi password sebelum disimpan ke database.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Membuat data pengguna baru dengan role USER secara default.
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Mengirim respons setelah registrasi berhasil.
    return res.status(201).json({
      success: true,
      message: "Registrasi berhasil.",
      data: user,
    });
  } catch (error) {
    // Menampilkan kesalahan pada terminal server.
    console.error("Kesalahan registrasi:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
};

// Controller untuk login pengguna.
export const login = async (req, res) => {
  try {
    // Mengambil email dan password dari request body.
    const { email, password } = req.body;

    // Memeriksa kelengkapan data login.
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi.",
      });
    }

    // Mencari pengguna berdasarkan email.
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Menolak login jika email tidak ditemukan.
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah.",
      });
    }

    // Membandingkan password dengan hash yang tersimpan.
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    // Menolak login jika password tidak cocok.
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah.",
      });
    }

    // Membuat token JWT berdasarkan identitas dan role pengguna.
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );

    // Mengirim token dan informasi pengguna tanpa password.
    return res.status(200).json({
      success: true,
      message: "Login berhasil.",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    // Menampilkan kesalahan pada terminal server.
    console.error("Kesalahan login:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
};

// Controller untuk mengambil profil pengguna yang sedang login.
export const getMe = async (req, res) => {
  try {
    // Mencari pengguna berdasarkan ID dari token JWT.
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Memeriksa apakah pengguna masih tersedia di database.
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan.",
      });
    }

    // Mengirim informasi profil pengguna.
    return res.status(200).json({
      success: true,
      message: "Profil pengguna berhasil ditemukan.",
      data: user,
    });
  } catch (error) {
    // Menampilkan kesalahan pada terminal server.
    console.error("Kesalahan mengambil profil:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
};

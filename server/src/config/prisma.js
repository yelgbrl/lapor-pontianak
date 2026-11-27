// Memuat environment variables dari file .env.
import "dotenv/config";

// Mengimpor PostgreSQL adapter untuk Prisma.
import { PrismaPg } from "@prisma/adapter-pg";

// Mengimpor Prisma Client yang telah dihasilkan Prisma.
import { PrismaClient } from "../../generated/prisma/client.ts";

// Membuat adapter dengan konfigurasi koneksi PostgreSQL.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// Membuat instance Prisma Client menggunakan adapter.
const prisma = new PrismaClient({
  adapter,
});

// Mengekspor Prisma Client agar dapat digunakan di seluruh backend.
export default prisma;


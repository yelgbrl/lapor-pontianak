// Mengimpor Express untuk membangun server dan API.
const express = require("express");

// Mengimpor CORS agar frontend dapat mengakses backend.
const cors = require("cors");

// Membuat aplikasi Express.
const app = express();

// Menentukan port server.
const PORT = process.env.PORT || 5000;

// Mengaktifkan middleware CORS.
app.use(cors());

// Mengizinkan server membaca request dalam format JSON.
app.use(express.json());

// Endpoint untuk memeriksa status backend.
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Lapor! Pontianak API is running!",
  });
});

// Menjalankan server.
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

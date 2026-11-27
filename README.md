# LAPOR! PONTIANAK

## Deskripsi
Lapor! Pontianak adalah aplikasi yang bertujuan
memfalisitasi masyarakat kota Pontianak untuk 
melaporkan kerusakan infrastruktur publik secara
mudah dan cepat.

Melalui aplikasi ini, masyarakat dapat mengirimkan
laporan kerusakan infrastruktur dengan menyertakan
bukti foto dan lokasi kejadian, serta dapat memantau 
perkembangan penanganan laporan.

## Progress
### Tahap 1
Jumat, 20 November 2026
1. Inisialisasi branch main ke repo GitHub yang masih kosong.
2. Menambahkan branch chore yang berisi README.md.
3. Merge branch chore ke branch main. README.md sekarang berada di branch main.
### Tahap 2
Jumat, 27 November 2026
1. Melakukan instalasi dan konfigurasi PostgreSQL sebagai database aplikasi serta mengintegrasikannya dengan Prisma ORM.
2. Membuat rancangan database dan migration untuk menyimpan data pengguna, kategori, dan laporan.
3. Mengembangkan backend menggunakan Node.js dan Express.js, meliputi API autentikasi pengguna, pengelolaan kategori, serta pengelolaan dan pelacakan laporan.
4. Menerapkan autentikasi JWT, enkripsi password menggunakan bcrypt, serta pembatasan hak akses berdasarkan role USER dan ADMIN.
5. Melakukan pengujian API untuk memastikan fitur dan hak akses berjalan sesuai fungsinya.
6. Mengelola perubahan kode menggunakan Git dan GitHub melalui branch dan commit terpisah, kemudian melakukan merge Pull Request ke branch `develop`.
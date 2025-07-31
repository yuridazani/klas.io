// data.js

// Cek apakah sudah ada data di localStorage. Jika tidak, gunakan data contoh ini.
if (!localStorage.getItem('posts')) {

  // Data contoh awal
  const samplePosts = [
    {
      id: 1672531200001,
      type: 'tugas',
      title: 'Tugas Matematika Bab 5',
      dueDate: '2025-08-15',
      content: 'Kerjakan soal latihan halaman 50, nomor 1 sampai 10. Kumpulkan di meja saya sebelum jam istirahat.',
      postedAt: '2025-07-30'
    },
    {
      id: 1672531200002,
      type: 'pengumuman',
      title: 'Perubahan Jadwal Ujian',
      dueDate: null,
      content: 'Ujian Fisika yang seharusnya dilaksanakan hari Rabu, diundur menjadi hari Jumat di jam yang sama. Harap diperhatikan.',
      postedAt: '2025-07-28'
    },
    {
      id: 1672531200003,
      type: 'pengumuman',
      title: 'Kegiatan Class Meeting',
      dueDate: null,
      content: 'Akan diadakan class meeting pada hari Sabtu. Diharapkan semua siswa berpartisipasi dalam lomba yang ada.',
      postedAt: '2025-07-25'
    }
  ];

  // Simpan data contoh ke localStorage
  localStorage.setItem('posts', JSON.stringify(samplePosts));
}
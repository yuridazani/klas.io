// auth.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Mencegah form reload halaman

            const passwordInput = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');

            // Kita tentukan passwordnya di sini secara manual
            const ADMIN_PASSWORD = "admin123";

            if (passwordInput === ADMIN_PASSWORD) {
                // Sembunyikan pesan error jika sebelumnya muncul
                errorMessage.classList.add('hidden');
                
                // Ganti alert() dengan notifikasi baru
                showNotification('Login berhasil! Mengarahkan ke dasbor...');
                sessionStorage.setItem('isAdminLoggedIn', 'true');
                
                // Beri jeda sedikit agar notifikasi terlihat sebelum pindah halaman
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1500);

            } else {
                // Jika password salah
                errorMessage.classList.remove('hidden');
            }
        });
    }
});

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    
    const notification = document.createElement('div');
    // Kelas untuk styling dan animasi masuk
    notification.className = `p-4 rounded-lg shadow-lg text-white ${bgColor} mb-2 transition-all duration-300 transform translate-x-full`;
    notification.textContent = message;
    
    container.appendChild(notification);

    // Memicu animasi masuk
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 10);

    // Menghilangkan notifikasi setelah beberapa detik
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        // Hapus elemen dari DOM setelah animasi keluar selesai
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
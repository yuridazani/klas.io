// app.js

// =================================================================
// BAGIAN 1: FUNGSI UTAMA & PEMANGGILAN FUNGSI
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('posts-grid')) {
        displayPosts();
        initFiltersAndSearch();
    }
    if (document.getElementById('admin-posts-list')) {
        if (sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
            // Kita tidak bisa menggunakan notifikasi di sini karena akan langsung pindah halaman
            alert('Anda harus login terlebih dahulu.');
            window.location.href = 'login.html';
            return;
        }
        displayAdminPosts();
        initAdminForm();
    }
    if (document.getElementById('post-detail-content')) {
        displayPostDetail();
    }
});


// =================================================================
// BAGIAN 2: FUNGSI UNTUK HALAMAN SISWA (index.html)
// =================================================================
function displayPosts(filter = 'semua', searchQuery = '') {
    const postsGrid = document.getElementById('posts-grid');
    if (!postsGrid) return;
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.sort((a, b) => b.id - a.id);

    if (filter !== 'semua') {
        posts = posts.filter(post => post.type === filter);
    }
    if (searchQuery) {
        posts = posts.filter(post => 
            post.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    postsGrid.innerHTML = '';

    if (posts.length === 0) {
        postsGrid.innerHTML = `<div class="col-span-full text-center py-12"><img src="img/empty-state.svg" alt="Ilustrasi Papan Tulis Kosong" class="mx-auto h-40 w-40 mb-4"><h3 class="font-display text-xl font-bold text-gray-700">Papan Pengumuman Masih Kosong</h3><p class="text-gray-500 mt-2">Belum ada tugas atau pengumuman baru yang dipublikasikan.</p></div>`;
        return;
    }

    posts.forEach(post => {
        let postCard = '';
        const detailLink = `detail.html?id=${post.id}`;
        const shortContent = post.content.substring(0, 100) + (post.content.length > 100 ? '...' : '');
        if (post.type === 'tugas') {
            postCard = `<div class="bg-white border-2 border-blue-500 rounded-lg shadow-sm overflow-hidden flex flex-col justify-between"><div class="p-5"><div class="flex justify-between items-start mb-2"><div><span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"><i class="fas fa-clipboard-list mr-1"></i> Tugas</span></div><span class="text-xs text-gray-500">${new Date(post.postedAt).toLocaleDateString('id-ID')}</span></div><a href="${detailLink}" class="hover:text-blue-700"><h3 class="font-display text-xl font-bold mb-2">${post.title}</h3></a><p class="text-gray-600 text-sm mb-4">${shortContent}</p></div><div class="bg-blue-50 text-blue-800 px-5 py-3 text-sm font-semibold border-t border-blue-200"><i class="fas fa-calendar-alt mr-2"></i> Tenggat: ${new Date(post.dueDate).toLocaleDateString('id-ID')}</div></div>`;
        } else {
            postCard = `<div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col justify-between"><div class="p-5"><div class="flex justify-between items-start mb-2"><div><span class="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"><i class="fas fa-bullhorn mr-1"></i> Pengumuman</span></div><span class="text-xs text-gray-500">${new Date(post.postedAt).toLocaleDateString('id-ID')}</span></div><a href="${detailLink}" class="hover:text-blue-700"><h3 class="font-display text-xl font-bold mb-2">${post.title}</h3></a><p class="text-gray-600 text-sm">${shortContent}</p></div></div>`;
        }
        postsGrid.innerHTML += postCard;
    });
}

function initFiltersAndSearch() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const searchInput = document.getElementById('search-input');
    let currentFilter = 'semua';
    let currentSearch = '';

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-blue-600', 'text-white');
                btn.classList.add('bg-white', 'text-gray-700');
            });
            button.classList.add('bg-blue-600', 'text-white');
            button.classList.remove('bg-white', 'text-gray-700');
            currentFilter = button.dataset.filter;
            displayPosts(currentFilter, currentSearch);
        });
    });

    searchInput.addEventListener('input', () => {
        currentSearch = searchInput.value;
        displayPosts(currentFilter, currentSearch);
    });
}

function displayPostDetail() {
    const postDetailContent = document.getElementById('post-detail-content');
    if (!postDetailContent) return;
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('id'));
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts.find(p => p.id === postId);

    if (!post) {
        postDetailContent.innerHTML = `<p class="text-center text-red-500">Postingan tidak ditemukan atau telah dihapus.</p>`;
        return;
    }

    const postTypeTag = post.type === 'tugas' ? `<span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"><i class="fas fa-clipboard-list mr-1"></i> Tugas</span>` : `<span class="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"><i class="fas fa-bullhorn mr-1"></i> Pengumuman</span>`;
    let dueDateHtml = '';
    if (post.type === 'tugas' && post.dueDate) {
        dueDateHtml = `<div class="mt-6 pt-4 border-t border-gray-200 text-sm font-semibold text-blue-800"><i class="fas fa-calendar-alt mr-2"></i> Tenggat: ${new Date(post.dueDate).toLocaleDateString('id-ID')}</div>`;
    }
    const detailHtml = `<article class="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm"><div class="flex justify-between items-start mb-4">${postTypeTag}<span class="text-sm text-gray-500">Diposting: ${new Date(post.postedAt).toLocaleDateString('id-ID')}</span></div><h1 class="font-display text-3xl font-bold mb-6">${post.title}</h1><div class="prose max-w-none text-gray-700 leading-relaxed">${post.content.replace(/\n/g, '<br>')}</div>${dueDateHtml}</article>`;
    postDetailContent.innerHTML = detailHtml;
    document.title = `${post.title} - Klas.io`;
}


// =================================================================
// BAGIAN 3: FUNGSI UNTUK HALAMAN ADMIN (admin.html)
// =================================================================

function displayAdminPosts() {
    const adminPostsList = document.getElementById('admin-posts-list');
    if (!adminPostsList) return;
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.sort((a, b) => b.id - a.id);
    adminPostsList.innerHTML = '';
    if (posts.length === 0) {
        adminPostsList.innerHTML = `<p class="text-center text-gray-500 py-8">Belum ada postingan. Silakan buat yang pertama!</p>`;
        return;
    }
    posts.forEach(post => {
        const postTypeTag = post.type === 'tugas' ? `<span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">Tugas</span>` : `<span class="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">Pengumuman</span>`;
        const postItem = `<div class="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center"><div>${postTypeTag}<h3 class="font-semibold mt-1">${post.title}</h3><p class="text-xs text-gray-500">Diposting: ${new Date(post.postedAt).toLocaleDateString('id-ID')}</p></div><div class="space-x-2"><button class="text-gray-500 hover:text-green-600" onclick="editPost(${post.id})"><i class="fas fa-pencil-alt"></i></button><button class="text-gray-500 hover:text-red-600" onclick="deletePost(${post.id})"><i class="fas fa-trash-alt"></i></button></div></div>`;
        adminPostsList.innerHTML += postItem;
    });
}

function initAdminForm() {
    const postForm = document.getElementById('post-form');
    const postTypeSelect = document.getElementById('post-type');
    const dueDateWrapper = document.getElementById('due-date-wrapper');
    const formTitle = document.getElementById('form-title');
    const submitButton = document.getElementById('submit-button');
    const cancelEditButton = document.getElementById('cancel-edit-button');
    const postIdInput = document.getElementById('post-id');

    postTypeSelect.addEventListener('change', () => {
        dueDateWrapper.classList.toggle('hidden', postTypeSelect.value !== 'tugas');
    });
    
    cancelEditButton.addEventListener('click', () => {
        resetForm();
    });

    postForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const postId = postIdInput.value;
        const postData = {
            type: document.getElementById('post-type').value,
            title: document.getElementById('post-title').value,
            content: document.getElementById('post-content').value,
            dueDate: document.getElementById('post-type').value === 'tugas' ? document.getElementById('due-date').value : null,
        };
        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        if (postId) {
            const postIndex = posts.findIndex(p => p.id == postId);
            if (postIndex > -1) {
                posts[postIndex] = { ...posts[postIndex], ...postData };
                showNotification('Postingan berhasil diperbarui!');
            }
        } else {
            postData.id = Date.now();
            postData.postedAt = new Date().toISOString();
            posts.push(postData);
            showNotification('Postingan berhasil dipublikasikan!');
        }
        localStorage.setItem('posts', JSON.stringify(posts));
        resetForm();
        displayAdminPosts();
    });

    function resetForm() {
        postForm.reset();
        postIdInput.value = '';
        formTitle.textContent = 'Buat Postingan Baru';
        submitButton.innerHTML = '<i class="fas fa-paper-plane mr-2"></i> Publikasikan';
        dueDateWrapper.classList.add('hidden');
        cancelEditButton.classList.add('hidden');
    }
}

function editPost(postId) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postToEdit = posts.find(p => p.id === postId);
    if (!postToEdit) return;
    document.getElementById('post-id').value = postToEdit.id;
    document.getElementById('post-title').value = postToEdit.title;
    document.getElementById('post-content').value = postToEdit.content;
    document.getElementById('post-type').value = postToEdit.type;
    if (postToEdit.type === 'tugas' && postToEdit.dueDate) {
        document.getElementById('due-date').value = postToEdit.dueDate;
        document.getElementById('due-date-wrapper').classList.remove('hidden');
    } else {
         document.getElementById('due-date-wrapper').classList.add('hidden');
    }
    document.getElementById('form-title').textContent = 'Edit Postingan';
    document.getElementById('submit-button').innerHTML = '<i class="fas fa-save mr-2"></i> Simpan Perubahan';
    document.getElementById('cancel-edit-button').classList.remove('hidden');
    window.scrollTo(0, 0);
}

function deletePost(postId) {
    showNotification(
        'Apakah Anda yakin ingin menghapus postingan ini?', 
        'confirm', 
        () => {
            let posts = JSON.parse(localStorage.getItem('posts')) || [];
            const updatedPosts = posts.filter(post => post.id !== postId);
            localStorage.setItem('posts', JSON.stringify(updatedPosts));
            displayAdminPosts();
            showNotification('Postingan berhasil dihapus.');
        }
    );
}


// =================================================================
// BAGIAN 4: FUNGSI UNTUK SISTEM NOTIFIKASI
// =================================================================
function showNotification(message, type = 'success', onConfirm = null) {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const bgColor = type === 'success' ? 'bg-green-500' : (type === 'error' ? 'bg-red-500' : 'bg-yellow-500');
    
    const notification = document.createElement('div');
    notification.className = `p-4 rounded-lg shadow-lg text-white ${bgColor} mb-2 transition-all duration-300 transform translate-x-full`;
    
    let buttonsHtml = '';
    if (type === 'confirm') {
        buttonsHtml = `
            <div class="mt-2 pt-2 border-t border-white/50">
                <button class="confirm-yes font-bold py-1 px-2 rounded-md bg-white/20 hover:bg-white/40">Ya</button>
                <button class="confirm-no font-bold py-1 px-2 rounded-md hover:bg-white/20 ml-2">Tidak</button>
            </div>
        `;
    }
    
    notification.innerHTML = `<div>${message}</div>${buttonsHtml}`;
    container.appendChild(notification);
    
    // Memicu animasi masuk
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 10);

    const closeNotification = () => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    };

    if (type === 'confirm') {
        notification.querySelector('.confirm-yes').onclick = () => {
            if (onConfirm) onConfirm();
            closeNotification();
        };
        notification.querySelector('.confirm-no').onclick = closeNotification;
    } else {
        setTimeout(closeNotification, 3000);
    }
}
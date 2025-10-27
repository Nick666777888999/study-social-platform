// 主應用邏輯
document.addEventListener('DOMContentLoaded', function() {
    // 模擬加載動畫
    setTimeout(() => {
        document.getElementById('loading-animation').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
    }, 2000);

    // 模態框控制
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeButtons = document.querySelectorAll('.close');

    // 打開登入模態框
    loginBtn.addEventListener('click', () => {
        loginModal.classList.remove('hidden');
    });

    // 打開註冊模態框
    registerBtn.addEventListener('click', () => {
        registerModal.classList.remove('hidden');
    });

    // 關閉模態框
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.add('hidden');
        });
    });

    // 點擊模態框外部關閉
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
    });

    // 表單提交處理
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('登入功能開發中...');
    });

    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('註冊功能開發中...');
    });
});

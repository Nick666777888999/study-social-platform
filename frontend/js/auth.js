// 身份驗證管理
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }
    
    // 初始化
    init() {
        this.checkExistingAuth();
        this.setupEventListeners();
    }
    
    // 檢查現有認證
    async checkExistingAuth() {
        const token = Utils.getStorage(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        const userData = Utils.getStorage(CONFIG.STORAGE_KEYS.USER_DATA);
        
        if (token && userData) {
            api.setToken(token);
            this.currentUser = userData;
            this.isAuthenticated = true;
            
            // 驗證令牌是否有效
            try {
                await api.getCurrentUser();
                this.onAuthSuccess(userData);
            } catch (error) {
                this.logout();
            }
        }
    }
    
    // 設定事件監聽器
    setupEventListeners() {
        // 登入表單
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // 註冊表單
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
        
        // 密碼顯示/隱藏
        const passwordToggles = document.querySelectorAll('.password-toggle');
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => this.togglePasswordVisibility(e));
        });
        
        // 表單切換
        const switchToRegister = document.getElementById('switch-to-register');
        const switchToLogin = document.getElementById('switch-to-login');
        
        if (switchToRegister) {
            switchToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegisterForm();
            });
        }
        
        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginForm();
            });
        }
    }
    
    // 處理登入
    async handleLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const credentials = {
            username: formData.get('username') || document.getElementById('login-username').value,
            password: formData.get('password') || document.getElementById('login-password').value
        };
        
        // 表單驗證
        if (!this.validateLoginForm(credentials)) {
            return;
        }
        
        // 顯示載入狀態
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 登入中...';
        submitBtn.disabled = true;
        
        try {
            const response = await api.login(credentials);
            await this.processLoginResponse(response);
        } catch (error) {
            this.handleAuthError(error, '登入');
        } finally {
            // 恢復按鈕狀態
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    // 處理註冊
    async handleRegister(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const userData = {
            username: document.getElementById('register-username').value,
            email: document.getElementById('register-email').value,
            full_name: document.getElementById('register-fullname').value || undefined,
            password: document.getElementById('register-password').value
        };
        
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        // 表單驗證
        if (!this.validateRegisterForm(userData, confirmPassword)) {
            return;
        }
        
        // 顯示載入狀態
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 註冊中...';
        submitBtn.disabled = true;
        
        try {
            const response = await api.register(userData);
            await this.processRegisterResponse(response);
        } catch (error) {
            this.handleAuthError(error, '註冊');
        } finally {
            // 恢復按鈕狀態
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    // 驗證登入表單
    validateLoginForm(credentials) {
        if (!credentials.username.trim()) {
            Utils.showError('請輸入用戶名或電子郵件');
            return false;
        }
        
        if (!credentials.password) {
            Utils.showError('請輸入密碼');
            return false;
        }
        
        return true;
    }
    
    // 驗證註冊表單
    validateRegisterForm(userData, confirmPassword) {
        if (!Utils.validateUsername(userData.username)) {
            Utils.showError('用戶名必須是 3-20 個字符，只能包含字母、數字和下劃線');
            return false;
        }
        
        if (!Utils.validateEmail(userData.email)) {
            Utils.showError('請輸入有效的電子郵件地址');
            return false;
        }
        
        if (!Utils.validatePassword(userData.password)) {
            Utils.showError('密碼長度至少為 6 個字符');
            return false;
        }
        
        if (userData.password !== confirmPassword) {
            Utils.showError('兩次輸入的密碼不一致');
            return false;
        }
        
        const termsAccepted = document.getElementById('accept-terms').checked;
        if (!termsAccepted) {
            Utils.showError('請同意服務條款和隱私政策');
            return false;
        }
        
        return true;
    }
    
    // 處理登入回應
    async processLoginResponse(response) {
        const { access_token, user } = response;
        
        // 儲存令牌和用戶資料
        api.setToken(access_token);
        Utils.setStorage(CONFIG.STORAGE_KEYS.USER_DATA, user);
        
        this.currentUser = user;
        this.isAuthenticated = true;
        
        Utils.showSuccess(CONFIG.SUCCESS_MESSAGES.LOGIN_SUCCESS);
        this.onAuthSuccess(user);
    }
    
    // 處理註冊回應
    async processRegisterResponse(response) {
        const { user } = response;
        
        Utils.showSuccess(CONFIG.SUCCESS_MESSAGES.REGISTER_SUCCESS);
        
        // 自動登入
        const credentials = {
            username: user.username,
            password: document.getElementById('register-password').value
        };
        
        try {
            const loginResponse = await api.login(credentials);
            await this.processLoginResponse(loginResponse);
        } catch (error) {
            // 註冊成功但自動登入失敗，顯示登入表單
            this.showLoginForm();
            Utils.showSuccess('註冊成功！請使用您的帳號密碼登入');
        }
    }
    
    // 認證成功處理
    onAuthSuccess(user) {
        // 關閉模態框
        this.hideAuthModals();
        
        // 更新 UI
        this.updateUIForAuthenticatedUser(user);
        
        // 切換到主界面
        this.showDashboard();
        
        // 發送全域事件
        this.dispatchAuthEvent('auth:login', { user });
    }
    
    // 處理認證錯誤
    handleAuthError(error, action) {
        console.error(`${action} error:`, error);
        
        let message = error.message || `${action}失敗，請稍後再試`;
        
        if (error.status === 401) {
            message = '用戶名或密碼錯誤';
        } else if (error.status === 400) {
            message = '請檢查輸入的資料是否正確';
        } else if (error.status === 409) {
            message = '用戶名或電子郵件已被使用';
        }
        
        Utils.showError(message);
    }
    
    // 登出
    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        
        api.removeToken();
        Utils.removeStorage(CONFIG.STORAGE_KEYS.USER_DATA);
        
        // 更新 UI
        this.updateUIForUnauthenticatedUser();
        
        // 切換到首頁
        this.showHomepage();
        
        // 發送全域事件
        this.dispatchAuthEvent('auth:logout');
        
        Utils.showSuccess('已成功登出');
    }
    
    // 更新已認證用戶的 UI
    updateUIForAuthenticatedUser(user) {
        // 更新用戶資訊
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        const sidebarUserName = document.getElementById('sidebar-user-name');
        const sidebarUserEmail = document.getElementById('sidebar-user-email');
        
        if (userAvatar) {
            userAvatar.innerHTML = `<img src="${user.profile_image || CONFIG.DEFAULTS.AVATAR}" alt="${user.username}">`;
        }
        
        if (userName) {
            userName.textContent = user.full_name || user.username;
        }
        
        if (sidebarUserName) {
            sidebarUserName.textContent = user.full_name || user.username;
        }
        
        if (sidebarUserEmail) {
            sidebarUserEmail.textContent = user.email;
        }
        
        // 顯示管理員功能（如果適用）
        if (user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPER_ADMIN) {
            const adminSection = document.getElementById('admin-section');
            if (adminSection) {
                adminSection.classList.remove('hidden');
            }
        }
        
        // 隱藏登入/註冊按鈕，顯示用戶選單
        const authButtons = document.querySelector('.glowing-container');
        if (authButtons) {
            authButtons.style.display = 'none';
        }
    }
    
    // 更新未認證用戶的 UI
    updateUIForUnauthenticatedUser() {
        // 顯示登入/註冊按鈕
        const authButtons = document.querySelector('.glowing-container');
        if (authButtons) {
            authButtons.style.display = 'flex';
        }
        
        // 隱藏管理員功能
        const adminSection = document.getElementById('admin-section');
        if (adminSection) {
            adminSection.classList.add('hidden');
        }
    }
    
    // 顯示/隱藏表單
    showLoginForm() {
        this.hideAuthModals();
        document.getElementById('login-modal').classList.remove('hidden');
    }
    
    showRegisterForm() {
        this.hideAuthModals();
        document.getElementById('register-modal').classList.remove('hidden');
    }
    
    hideAuthModals() {
        document.getElementById('login-modal').classList.add('hidden');
        document.getElementById('register-modal').classList.add('hidden');
    }
    
    // 顯示頁面
    showDashboard() {
        document.getElementById('home-page').classList.remove('active');
        document.getElementById('dashboard-page').classList.add('active');
    }
    
    showHomepage() {
        document.getElementById('dashboard-page').classList.remove('active');
        document.getElementById('home-page').classList.add('active');
    }
    
    // 切換密碼可見性
    togglePasswordVisibility(e) {
        const button = e.target.closest('.password-toggle');
        const input = button.previousElementSibling;
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }
    
    // 發送認證事件
    dispatchAuthEvent(type, detail = {}) {
        const event = new CustomEvent(type, { detail });
        window.dispatchEvent(event);
    }
    
    // 檢查權限
    hasPermission(requiredRole) {
        if (!this.isAuthenticated) return false;
        
        const roleHierarchy = {
            [USER_ROLES.USER]: 1,
            [USER_ROLES.ADMIN]: 2,
            [USER_ROLES.SUPER_ADMIN]: 3
        };
        
        const userRoleLevel = roleHierarchy[this.currentUser.role] || 0;
        const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
        
        return userRoleLevel >= requiredRoleLevel;
    }
    
    // 獲取當前用戶
    getCurrentUser() {
        return this.currentUser;
    }
    
    // 檢查是否已認證
    getIsAuthenticated() {
        return this.isAuthenticated;
    }
}

// 創建全域認證管理器實例
window.authManager = new AuthManager();

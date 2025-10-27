// 主應用程式 - 修復版本
class StudySocialApp {
    constructor() {
        this.currentPage = 'home';
        this.isInitialized = false;
        this.init();
    }
    
    async init() {
        try {
            // 顯示加載動畫
            this.showLoadingAnimation();
            
            // 初始化各個模組
            await this.initializeModules();
            
            // 設置事件監聽器
            this.setupEventListeners();
            
            // 應用啟動完成
            this.onAppReady();
            
            this.isInitialized = true;
            
        } catch (error) {
            console.error('應用初始化失敗:', error);
            this.handleInitError(error);
        }
    }
    
    async initializeModules() {
        // 檢查後端健康狀態
        await this.checkBackendHealth();
        
        // 初始化用戶界面
        this.initializeUI();
        
        // 加載初始數據
        await this.loadInitialData();
    }
    
    async checkBackendHealth() {
        try {
            // 暫時註解後端檢查，因為後端還未部署
            // const health = await api.healthCheck();
            // console.log('後端服務狀態:', health.status);
            console.log('後端服務: 使用模擬數據模式');
        } catch (error) {
            console.warn('後端服務連接失敗，使用模擬數據模式');
        }
    }
    
    initializeUI() {
        // 更新平台統計數據
        this.updatePlatformStats();
        
        // 初始化功能卡片
        this.initializeFeatureCards();
        
        // 設置響應式監聽 - 修復：添加這個方法
        this.setupResponsiveListeners();
    }
    
    // 添加缺失的方法
    setupResponsiveListeners() {
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));
    }
    
    handleResize() {
        const width = window.innerWidth;
        console.log('視窗大小改變:', width);
        
        // 可以在這裡添加響應式邏輯
        if (width <= 768) {
            document.body.classList.add('mobile');
            document.body.classList.remove('tablet', 'desktop');
        } else if (width <= 1024) {
            document.body.classList.add('tablet');
            document.body.classList.remove('mobile', 'desktop');
        } else {
            document.body.classList.add('desktop');
            document.body.classList.remove('mobile', 'tablet');
        }
    }
    
    async loadInitialData() {
        // 如果用戶已登入，加載用戶數據
        if (authManager.getIsAuthenticated()) {
            await this.loadUserData();
        }
    }
    
    async loadUserData() {
        try {
            const user = authManager.getCurrentUser();
            
            // 更新用戶統計
            this.updateUserStats(user);
            
            // 加載用戶通知
            await this.loadUserNotifications();
            
        } catch (error) {
            console.error('加載用戶數據失敗:', error);
        }
    }
    
    setupEventListeners() {
        // 全域點擊事件
        document.addEventListener('click', (e) => {
            this.handleGlobalClick(e);
        });
        
        // 鍵盤快捷鍵
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
        
        // 網路狀態監聽
        Utils.addOnlineListener(() => {
            this.handleOnlineStatus();
        });
        
        Utils.addOfflineListener(() => {
            this.handleOfflineStatus();
        });
        
        // 頁面可見性改變
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
        
        // 認證狀態改變
        window.addEventListener('auth:login', (e) => {
            this.handleUserLogin(e.detail.user);
        });
        
        window.addEventListener('auth:logout', () => {
            this.handleUserLogout();
        });
        
        // 初始化響應式狀態
        this.handleResize();
    }
    
    handleGlobalClick(e) {
        // 處理外部點擊關閉下拉選單等
        const dropdowns = document.querySelectorAll('.dropdown.show');
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    }
    
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K: 全域搜尋
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('global-search');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape: 關閉模態框和面板
        if (e.key === 'Escape') {
            this.closeAllModals();
        }
    }
    
    handleOnlineStatus() {
        Utils.showSuccess('網路連接已恢復', 2000);
        this.syncOfflineData();
    }
    
    handleOfflineStatus() {
        Utils.showWarning('網路連接中斷，部分功能可能受限', 5000);
    }
    
    handleVisibilityChange() {
        if (!document.hidden) {
            // 頁面重新可見時刷新數據
            this.refreshData();
        }
    }
    
    handleUserLogin(user) {
        console.log('用戶登入:', user.username);
        this.loadUserData();
        this.trackUserActivity('login');
    }
    
    handleUserLogout() {
        console.log('用戶登出');
        this.trackUserActivity('logout');
    }
    
    // 加載動畫
    showLoadingAnimation() {
        const loadingScreen = document.getElementById('loading-animation');
        const progressFill = document.getElementById('loading-progress');
        
        if (loadingScreen && progressFill) {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 10;
                if (progress > 100) progress = 100;
                progressFill.style.width = `${progress}%`;
                
                if (progress === 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        loadingScreen.classList.add('hidden');
                        document.getElementById('app').classList.remove('hidden');
                    }, 500);
                }
            }, 100);
        }
    }
    
    // 更新平台統計
    updatePlatformStats() {
        // 使用模擬數據
        const stats = {
            users: Utils.random(1000, 2000),
            studyRooms: Utils.random(500, 1000),
            posts: Utils.random(8000, 10000)
        };
        
        const usersCount = document.getElementById('users-count');
        const studyRoomsCount = document.getElementById('study-rooms-count');
        const postsCount = document.getElementById('posts-count');
        
        if (usersCount) usersCount.textContent = Utils.formatNumber(stats.users);
        if (studyRoomsCount) studyRoomsCount.textContent = Utils.formatNumber(stats.studyRooms);
        if (postsCount) postsCount.textContent = Utils.formatNumber(stats.posts);
    }
    
    // 初始化功能卡片
    initializeFeatureCards() {
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate-slide-in-up');
            
            // 點擊事件
            card.addEventListener('click', () => {
                this.handleFeatureCardClick(card);
            });
        });
    }
    
    handleFeatureCardClick(card) {
        const title = card.querySelector('h3').textContent;
        
        if (authManager.getIsAuthenticated()) {
            // 根據功能標題導航到對應頁面
            this.navigateToFeature(title);
        } else {
            // 未登入時顯示登入提示
            Utils.showWarning(`請先登入以使用 ${title} 功能`);
            authManager.showLoginForm();
        }
    }
    
    navigateToFeature(featureTitle) {
        const featureMap = {
            '智慧好友系統': 'friends',
            '即時聊天系統': 'chat',
            '全域聊天廣場': 'chat',
            '個人學習檔案': 'dashboard',
            '學科討論區': 'discussion',
            '虛擬自習室': 'study-rooms',
            'AI學習助手': 'ai-assistant'
        };
        
        const targetPage = featureMap[featureTitle] || 'dashboard';
        componentManager.loadPage(targetPage);
    }
    
    // 更新用戶統計
    updateUserStats(user) {
        // 模擬用戶數據
        const userStats = {
            friends: Utils.random(5, 50),
            posts: Utils.random(1, 20)
        };
        
        const userFriends = document.getElementById('user-friends');
        const userPosts = document.getElementById('user-posts');
        
        if (userFriends) userFriends.textContent = userStats.friends;
        if (userPosts) userPosts.textContent = userStats.posts;
    }
    
    // 加載用戶通知
    async loadUserNotifications() {
        // 使用模擬數據
        console.log('加載用戶通知...');
    }
    
    // 同步離線數據
    async syncOfflineData() {
        // 實現離線數據同步邏輯
        console.log('同步離線數據...');
    }
    
    // 刷新數據
    async refreshData() {
        if (authManager.getIsAuthenticated()) {
            await this.loadUserData();
        }
        this.updatePlatformStats();
    }
    
    // 關閉所有模態框
    closeAllModals() {
        const modals = document.querySelectorAll('.modal:not(.hidden)');
        const panels = document.querySelectorAll('.panel.active');
        
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
        
        panels.forEach(panel => {
            panel.classList.remove('active');
        });
        
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
        
        document.body.style.overflow = '';
    }
    
    // 追蹤用戶活動
    trackUserActivity(action, data = {}) {
        const activity = {
            action,
            timestamp: new Date().toISOString(),
            user: authManager.getCurrentUser()?.username || 'anonymous',
            ...data
        };
        
        console.log('用戶活動:', activity);
        // 實際應用中這裡會發送到分析服務
    }
    
    // 應用準備完成
    onAppReady() {
        console.log(`${CONFIG.APP.NAME} v${CONFIG.APP.VERSION} 啟動完成`);
        
        // 顯示歡迎訊息
        if (authManager.getIsAuthenticated()) {
            const user = authManager.getCurrentUser();
            Utils.showSuccess(`歡迎回來，${user.full_name || user.username}！`);
        }
        
        // 發送應用就緒事件
        window.dispatchEvent(new CustomEvent('app:ready'));
    }
    
    // 處理初始化錯誤
    handleInitError(error) {
        const app = document.getElementById('app');
        const loadingScreen = document.getElementById('loading-animation');
        
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        
        if (app) {
            app.classList.remove('hidden');
            app.innerHTML = `
                <div class="error-screen">
                    <div class="error-content">
                        <i class="fas fa-exclamation-triangle fa-4x"></i>
                        <h1>應用啟動失敗</h1>
                        <p>${error.message || '未知錯誤'}</p>
                        <div class="error-actions">
                            <button class="btn btn-primary" onclick="location.reload()">
                                <i class="fas fa-redo"></i>
                                重新載入
                            </button>
                            <button class="btn btn-secondary" onclick="studySocialApp.init()">
                                <i class="fas fa-play"></i>
                                重新嘗試
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    // 全域方法
    navigateTo(page) {
        this.currentPage = page;
        componentManager.loadPage(page);
    }
    
    getCurrentUser() {
        return authManager.getCurrentUser();
    }
    
    isAuthenticated() {
        return authManager.getIsAuthenticated();
    }
    
    // 開發工具
    showDevTools() {
        if (console && console.table) {
            console.table({
                '應用版本': CONFIG.APP.VERSION,
                '當前用戶': this.getCurrentUser()?.username || '未登入',
                '認證狀態': this.isAuthenticated(),
                '網路狀態': Utils.isOnline() ? '在線' : '離線',
                '設備類型': Utils.isMobile() ? '手機' : Utils.isTablet() ? '平板' : '桌面'
            });
        }
    }
}

// 啟動應用
document.addEventListener('DOMContentLoaded', () => {
    window.studySocialApp = new StudySocialApp();
    
    // 開發工具快捷鍵
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            studySocialApp.showDevTools();
        }
    });
});

// 服務工作者註冊（PWA 支持）- 修復：移除不存在的 sw.js
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/sw.js')
//             .then(registration => {
//                 console.log('SW registered: ', registration);
//             })
//             .catch(registrationError => {
//                 console.log('SW registration failed: ', registrationError);
//             });
//     });
// }

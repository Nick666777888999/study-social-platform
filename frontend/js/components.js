// 組件管理器 - 修復版本
class ComponentManager {
    constructor() {
        this.components = new Map();
        this.init();
    }
    
    init() {
        this.setupGlobalEventListeners();
        this.loadInitialComponents();
    }
    
    setupGlobalEventListeners() {
        // 模態框關閉
        document.addEventListener('click', (e) => {
            // 點擊模態框外部關閉
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target);
            }
            
            // 點擊關閉按鈕
            if (e.target.closest('.modal-close') || e.target.closest('.panel-close')) {
                const modal = e.target.closest('.modal, .panel');
                if (modal) {
                    this.hideModal(modal);
                }
            }
        });
        
        // 側邊欄切換
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }
        
        // 導航選單
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(item);
            });
        });
    }
    
    loadInitialComponents() {
        this.loadFeaturesGrid();
        this.loadNotifications();
        this.loadUserStats();
    }
    
    // 功能網格組件
    loadFeaturesGrid() {
        const featuresGrid = document.querySelector('.features-grid');
        if (!featuresGrid) return;
        
        const features = [
            {
                icon: '👥',
                title: '智慧好友系統',
                description: 'ID搜尋/二維碼加好友，根據學習興趣智能推薦好友，好友分類標籤管理',
                color: '#667eea'
            },
            {
                icon: '💬',
                title: '即時聊天系統',
                description: '一對一私訊、群組聊天，支持語音訊息和圖片分享，已讀標示和在線狀態',
                color: '#764ba2'
            },
            {
                icon: '🌍',
                title: '全域聊天廣場',
                description: '主題頻道討論、匿名聊天模式、熱門話題排行榜',
                color: '#f093fb'
            }
        ];
        
        featuresGrid.innerHTML = features.map(feature => `
            <div class="feature-card hover-lift" style="border-left: 4px solid ${feature.color}">
                <h3>
                    <span class="feature-icon">${feature.icon}</span>
                    ${feature.title}
                </h3>
                <p>${feature.description}</p>
                <div class="feature-actions">
                    <button class="btn btn-ghost btn-small">了解更多</button>
                </div>
            </div>
        `).join('');
    }
    
    // 通知組件
    loadNotifications() {
        const notificationsList = document.getElementById('notifications-list');
        if (!notificationsList) return;
        
        // 簡單的通知數據
        const notifications = [
            {
                id: 1,
                title: '歡迎使用',
                message: '歡迎來到 Study Social Platform！',
                time: '剛剛',
                read: false
            }
        ];
        
        notificationsList.innerHTML = notifications.map(notification => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
                <div class="notification-content">
                    <h4>${notification.title}</h4>
                    <p>${notification.message}</p>
                    <span class="notification-time">${notification.time}</span>
                </div>
            </div>
        `).join('');
    }
    
    // 用戶統計組件
    loadUserStats() {
        this.updateLiveData();
    }
    
    updateLiveData() {
        // 簡單的數據更新
        const elements = {
            'online-users': 128,
            'today-messages': 2847,
            'study-hours': 15632
        };
        
        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = elements[id].toLocaleString();
            }
        });
    }
    
    // 模態框控制
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }
    
    hideModal(modal) {
        modal.classList.add('hidden');
    }
    
    // 側邊欄控制
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('collapsed');
        }
    }
    
    // 導航處理
    handleNavigation(navItem) {
        const targetPage = navItem.dataset.page;
        
        // 移除所有活躍狀態
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // 設置當前活躍狀態
        navItem.classList.add('active');
        
        // 顯示簡單的頁面內容
        this.loadPage(targetPage);
    }
    
    // 頁面加載
    async loadPage(page) {
        const pageContent = document.getElementById('page-content');
        if (!pageContent) return;
        
        let content = '';
        
        switch (page) {
            case 'dashboard':
                content = this.renderDashboard();
                break;
            case 'friends':
                content = this.renderFriends();
                break;
            case 'chat':
                content = this.renderChat();
                break;
            case 'study-rooms':
                content = this.renderStudyRooms();
                break;
            default:
                content = this.renderDashboard();
        }
        
        pageContent.innerHTML = content;
    }
    
    renderDashboard() {
        return `
            <div class="page-wrapper">
                <div class="page-header">
                    <h1>學習儀表板</h1>
                    <p>歡迎回來！這是您的學習進度總覽</p>
                </div>
                <div class="dashboard-grid">
                    <div class="stats-card">
                        <div class="stats-icon" style="background: var(--primary-color)">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stats-content">
                            <h3>本週學習時間</h3>
                            <div class="stats-value">12.5 小時</div>
                            <div class="stats-trend up">
                                <i class="fas fa-arrow-up"></i>
                                <span>比上週增加 15%</span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-icon" style="background: var(--success-color)">
                            <i class="fas fa-tasks"></i>
                        </div>
                        <div class="stats-content">
                            <h3>完成目標</h3>
                            <div class="stats-value">8/12</div>
                            <div class="stats-trend up">
                                <i class="fas fa-arrow-up"></i>
                                <span>67% 完成率</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderFriends() {
        return `
            <div class="page-wrapper">
                <div class="page-header">
                    <h1>好友系統</h1>
                    <p>管理您的好友和聯繫人</p>
                </div>
                <div class="page-placeholder">
                    <i class="fas fa-users fa-3x"></i>
                    <h2>好友功能開發中</h2>
                    <p>我們正在努力開發完整的好友系統</p>
                </div>
            </div>
        `;
    }
    
    renderChat() {
        return `
            <div class="page-wrapper">
                <div class="page-header">
                    <h1>即時聊天</h1>
                    <p>與好友和學習夥伴即時交流</p>
                </div>
                <div class="page-placeholder">
                    <i class="fas fa-comments fa-3x"></i>
                    <h2>聊天功能開發中</h2>
                    <p>我們正在開發完整的即時聊天系統</p>
                </div>
            </div>
        `;
    }
    
    renderStudyRooms() {
        return `
            <div class="page-wrapper">
                <div class="page-header">
                    <h1>學習空間</h1>
                    <p>加入或創建專屬學習環境</p>
                </div>
                <div class="page-placeholder">
                    <i class="fas fa-door-open fa-3x"></i>
                    <h2>學習空間開發中</h2>
                    <p>我們正在開發虛擬自習室功能</p>
                </div>
            </div>
        `;
    }
}

// 創建全域組件管理器實例
window.componentManager = new ComponentManager();

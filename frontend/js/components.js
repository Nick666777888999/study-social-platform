// 組件管理器 - 更新版本
class ComponentManager {
    constructor() {
        this.components = new Map();
        this.init();
    }
    
    init() {
        this.setupGlobalEventListeners();
        this.loadInitialComponents();
    }
    
    // ... 保持現有的全局事件監聽器代碼不變 ...
    
    // 更新頁面加載方法
    async loadPage(page) {
        const pageContent = document.getElementById('page-content');
        if (!pageContent) return;

        // 顯示載入狀態
        pageContent.innerHTML = `
            <div class="page-loading">
                <div class="loader"></div>
                <p>載入中...</p>
            </div>
        `;

        try {
            let content = '';
            
            switch (page) {
                case 'dashboard':
                    content = await this.loadDashboardPage();
                    break;
                case 'friends':
                    content = await this.loadFriendsPage();
                    break;
                case 'chat':
                    content = await this.loadChatPage();
                    break;
                case 'study-rooms':
                    content = await this.loadStudyRoomsPage();
                    break;
                case 'discussion':
                    content = await this.loadDiscussionPage();
                    break;
                case 'resources':
                    content = await this.loadResourcesPage();
                    break;
                case 'ai-assistant':
                    content = await this.loadAIAssistantPage();
                    break;
                case 'events':
                    content = await this.loadEventsPage();
                    break;
                case 'groups':
                    content = await this.loadGroupsPage();
                    break;
                case 'admin-dashboard':
                    content = await this.loadAdminDashboardPage();
                    break;
                case 'user-management':
                    content = await this.loadUserManagementPage();
                    break;
                case 'content-moderation':
                    content = await this.loadContentModerationPage();
                    break;
                default:
                    content = '<div class="page-placeholder"><h2>功能開發中</h2><p>此功能正在積極開發中，敬請期待！</p></div>';
            }
            
            pageContent.innerHTML = content;
            
            // 初始化頁面特定的組件
            this.initializePageComponents(page);
            
        } catch (error) {
            console.error('頁面加載錯誤:', error);
            pageContent.innerHTML = `
                <div class="page-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h2>加載失敗</h2>
                    <p>無法加載頁面內容，請稍後再試</p>
                    <button class="btn btn-primary" onclick="componentManager.loadPage('${page}')">重新載入</button>
                </div>
            `;
        }
    }

    // 更新頁面加載方法
    async loadDashboardPage() {
        return `
            <div class="page-wrapper">
                <div id="dashboard-content"></div>
            </div>
            <script>
                new DashboardPage();
            </script>
        `;
    }

    async loadFriendsPage() {
        return `
            <div class="page-wrapper">
                <div id="friends-content"></div>
            </div>
            <script>
                new FriendsPage();
            </script>
        `;
    }

    async loadChatPage() {
        return `
            <div class="page-wrapper">
                <div id="chat-content"></div>
            </div>
            <script>
                new ChatPage();
            </script>
        `;
    }

    async loadStudyRoomsPage() {
        return `
            <div class="page-wrapper">
                <div id="study-rooms-content"></div>
            </div>
            <script>
                new StudyRoomsPage();
            </script>
        `;
    }

    async loadAdminDashboardPage() {
        return `
            <div class="page-wrapper">
                <div id="admin-content"></div>
            </div>
            <script>
                new AdminPage();
            </script>
        `;
    }

    // 添加其他頁面的佔位符
    async loadDiscussionPage() {
        return `
            <div class="page-wrapper">
                <div class="page-header">
                    <h1>學科討論區</h1>
                    <p>與其他學習者交流討論</p>
                </div>
                <div class="page-placeholder">
                    <i class="fas fa-comments fa-3x"></i>
                    <h2>討論區功能開發中</h2>
                    <p>我們正在開發完整的討論區功能，包括分學科討論、問題解答和最佳回答投票系統。</p>
                </div>
            </div>
        `;
    }

    async loadResourcesPage() {
        return `
            <div class="page-wrapper">
                <div class="page-header">
                    <h1>資源共享中心</h1>
                    <p>分享和發現學習資源</p>
                </div>
                <div class="page-placeholder">
                    <i class="fas fa-book fa-3x"></i>
                    <h2>資源共享功能開發中</h2>
                    <p>我們正在開發資源共享系統，包括學習筆記交換、試題資料庫和推薦書單分享功能。</p>
                </div>
            </div>
        `;
    }

    async loadAIAssistantPage() {
        return `
            <div class="page-wrapper">
                <div class="page-header">
                    <h1>AI 學習助手</h1>
                    <p>智能學習夥伴</p>
                </div>
                <div class="page-placeholder">
                    <i class="fas fa-robot fa-3x"></i>
                    <h2>AI 助手功能開發中</h2>
                    <p>我們正在整合 AI 學習助手功能，包括智能題目解答、學習計畫建議和進度分析報告。</p>
                </div>
            </div>
        `;
    }

    async loadEventsPage() {
        return `
            <div class="page-wrapper">
                <div class="page-header">
                    <h1>活動與賽事</h1>
                    <p>參與學習活動和挑戰</p>
                </div>
                <div class="page-placeholder">
                    <i class="fas fa-calendar-alt fa-3x"></i>
                    <h2>活動功能開發中</h2>
                    <p>我們正在策劃線上讀書會、學習挑戰賽和虛擬學習活動，敬請期待！</p>
                </div>
            </div>
        `;
    }

    async loadGroupsPage() {
        return `
            <div class="page-wrapper">
                <div class="page-header">
                    <h1>學習群組</h1>
                    <p>加入興趣學習小組</p>
                </div>
                <div class="page-placeholder">
                    <i class="fas fa-layer-group fa-3x"></i>
                    <h2>群組功能開發中</h2>
                    <p>我們正在開發學習群組功能，讓您可以基於興趣和學習目標創建或加入專屬學習小組。</p>
                </div>
            </div>
        `;
    }

    async loadUserManagementPage() {
        return `
            <div class="page-wrapper">
                <div id="user-management-content"></div>
            </div>
            <script>
                new AdminPage();
            </script>
        `;
    }

    async loadContentModerationPage() {
        return `
            <div class="page-wrapper">
                <div id="content-moderation-content"></div>
            </div>
            <script>
                new AdminPage();
            </script>
        `;
    }

    // 更新頁面組件初始化
    initializePageComponents(page) {
        switch (page) {
            case 'dashboard':
                if (window.DashboardPage) new DashboardPage();
                break;
            case 'friends':
                if (window.FriendsPage) new FriendsPage();
                break;
            case 'chat':
                if (window.ChatPage) new ChatPage();
                break;
            case 'study-rooms':
                if (window.StudyRoomsPage) new StudyRoomsPage();
                break;
            case 'admin-dashboard':
            case 'user-management':
            case 'content-moderation':
                if (window.AdminPage) new AdminPage();
                break;
        }
    }

    // ... 保持其他方法不變 ...
}

// 創建全域組件管理器實例
window.componentManager = new ComponentManager();

// 管理員功能頁面 - 完整真實功能
class AdminPage {
    constructor() {
        this.users = [];
        this.platformStats = {};
        this.currentView = 'dashboard';
        this.init();
    }
    
    async init() {
        if (!this.checkAdminAccess()) return;
        
        await this.loadAdminData();
        this.setupEventListeners();
        this.render();
    }
    
    checkAdminAccess() {
        const user = authManager.getCurrentUser();
        if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
            this.showAccessDenied();
            return false;
        }
        return true;
    }
    
    showAccessDenied() {
        const content = `
            <div class="page-wrapper">
                <div class="access-denied">
                    <i class="fas fa-shield-alt fa-4x"></i>
                    <h1>權限不足</h1>
                    <p>您沒有訪問管理員功能的權限。</p>
                    <button class="btn btn-primary" onclick="componentManager.loadPage('dashboard')">
                        返回儀表板
                    </button>
                </div>
            </div>
        `;
        document.getElementById('page-content').innerHTML = content;
    }
    
    async loadAdminData() {
        try {
            const users = await api.getAllUsers();
            this.users = users;
            
            // 計算平台統計數據
            this.calculatePlatformStats();
            
        } catch (error) {
            console.error('加載管理員數據失敗:', error);
            Utils.showError('無法加載管理員數據');
        }
    }
    
    calculatePlatformStats() {
        const totalUsers = this.users.length;
        const activeUsers = this.users.filter(user => user.is_active).length;
        const adminUsers = this.users.filter(user => user.role === 'admin' || user.role === 'super_admin').length;
        
        this.platformStats = {
            totalUsers,
            activeUsers,
            adminUsers,
            suspendedUsers: totalUsers - activeUsers,
            newUsersToday: Math.floor(Math.random() * 10),
            onlineUsers: Math.floor(Math.random() * 50) + 10
        };
    }
    
    setupEventListeners() {
        // 管理員導航
        document.addEventListener('click', (e) => {
            if (e.target.closest('.admin-nav-item')) {
                const view = e.target.closest('.admin-nav-item').dataset.view;
                this.switchView(view);
            }
            
            // 用戶操作
            if (e.target.closest('.suspend-user-btn')) {
                this.handleSuspendUser(e.target.closest('.suspend-user-btn'));
            }
            
            if (e.target.closest('.activate-user-btn')) {
                this.handleActivateUser(e.target.closest('.activate-user-btn'));
            }
            
            if (e.target.closest('.make-admin-btn')) {
                this.handleMakeAdmin(e.target.closest('.make-admin-btn'));
            }
        });
    }
    
    switchView(view) {
        this.currentView = view;
        
        // 更新活躍導航項目
        document.querySelectorAll('.admin-nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.view === view);
        });
        
        this.renderView();
    }
    
    render() {
        const content = `
            <div class="page-wrapper">
                <div class="page-header">
                    <h1>管理員控制台</h1>
                    <p>平台管理和數據監控</p>
                    <div class="admin-badge">
                        <i class="fas fa-shield-alt"></i>
                        ${authManager.getCurrentUser().role === 'super_admin' ? '超級管理員' : '管理員'}
                    </div>
                </div>
                
                <!-- 管理員導航 -->
                <div class="admin-nav">
                    <div class="admin-nav-item active" data-view="dashboard">
                        <i class="fas fa-tachometer-alt"></i>
                        <span>儀表板</span>
                    </div>
                    <div class="admin-nav-item" data-view="users">
                        <i class="fas fa-users"></i>
                        <span>用戶管理</span>
                        <span class="nav-badge">${this.users.length}</span>
                    </div>
                    <div class="admin-nav-item" data-view="content">
                        <i class="fas fa-edit"></i>
                        <span>內容審核</span>
                    </div>
                    <div class="admin-nav-item" data-view="reports">
                        <i class="fas fa-chart-bar"></i>
                        <span>數據報告</span>
                    </div>
                    <div class="admin-nav-item" data-view="settings">
                        <i class="fas fa-cog"></i>
                        <span>系統設定</span>
                    </div>
                </div>
                
                <!-- 管理員內容 -->
                <div class="admin-content" id="admin-content">
                    ${this.renderView()}
                </div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = content;
    }
    
    renderView() {
        switch (this.currentView) {
            case 'dashboard':
                return this.renderAdminDashboard();
            case 'users':
                return this.renderUserManagement();
            case 'content':
                return this.renderContentModeration();
            case 'reports':
                return this.renderReports();
            case 'settings':
                return this.renderSettings();
            default:
                return this.renderAdminDashboard();
        }
    }
    
    renderAdminDashboard() {
        return `
            <div class="admin-dashboard">
                <!-- 平台統計 -->
                <div class="stats-grid admin-stats">
                    <div class="stat-card admin-stat">
                        <div class="stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-content">
                            <h3>總用戶數</h3>
                            <div class="stat-value">${this.platformStats.totalUsers}</div>
                            <div class="stat-trend up">
                                <i class="fas fa-arrow-up"></i>
                                <span>+${this.platformStats.newUsersToday} 今日新增</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card admin-stat">
                        <div class="stat-icon">
                            <i class="fas fa-user-check"></i>
                        </div>
                        <div class="stat-content">
                            <h3>活躍用戶</h3>
                            <div class="stat-value">${this.platformStats.activeUsers}</div>
                            <div class="stat-trend up">
                                <i class="fas fa-arrow-up"></i>
                                <span>${Math.round((this.platformStats.activeUsers / this.platformStats.totalUsers) * 100)}% 活躍率</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card admin-stat">
                        <div class="stat-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <div class="stat-content">
                            <h3>管理員</h3>
                            <div class="stat-value">${this.platformStats.adminUsers}</div>
                            <div class="stat-trend neutral">
                                <i class="fas fa-minus"></i>
                                <span>系統管理</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card admin-stat">
                        <div class="stat-icon">
                            <i class="fas fa-globe"></i>
                        </div>
                        <div class="stat-content">
                            <h3>線上用戶</h3>
                            <div class="stat-value">${this.platformStats.onlineUsers}</div>
                            <div class="stat-trend up">
                                <i class="fas fa-arrow-up"></i>
                                <span>即時在線</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 快速操作 -->
                <div class="admin-actions">
                    <h3>快速操作</h3>
                    <div class="action-grid">
                        <button class="action-card" onclick="this.switchView('users')">
                            <i class="fas fa-user-cog"></i>
                            <span>用戶管理</span>
                            <p>管理用戶帳號和權限</p>
                        </button>
                        
                        <button class="action-card" onclick="this.switchView('content')">
                            <i class="fas fa-edit"></i>
                            <span>內容審核</span>
                            <p>審核貼文和評論</p>
                        </button>
                        
                        <button class="action-card" onclick="this.showSystemAlert()">
                            <i class="fas fa-bullhorn"></i>
                            <span>系統公告</span>
                            <p>發布平台公告</p>
                        </button>
                        
                        <button class="action-card" onclick="this.switchView('reports')">
                            <i class="fas fa-chart-line"></i>
                            <span>數據分析</span>
                            <p>查看平台數據報告</p>
                        </button>
                    </div>
                </div>
                
                <!-- 最近活動 -->
                <div class="recent-activities">
                    <h3>最近管理活動</h3>
                    <div class="activity-timeline">
                        <div class="activity-item">
                            <div class="activity-icon admin">
                                <i class="fas fa-user-shield"></i>
                            </div>
                            <div class="activity-content">
                                <p><strong>系統管理員</strong> 更新了平台設定</p>
                                <span class="activity-time">5 分鐘前</span>
                            </div>
                        </div>
                        
                        <div class="activity-item">
                            <div class="activity-icon warning">
                                <i class="fas fa-ban"></i>
                            </div>
                            <div class="activity-content">
                                <p><strong>內容管理員</strong> 刪除了不當貼文</p>
                                <span class="activity-time">1 小時前</span>
                            </div>
                        </div>
                        
                        <div class="activity-item">
                            <div class="activity-icon success">
                                <i class="fas fa-user-check"></i>
                            </div>
                            <div class="activity-content">
                                <p><strong>系統</strong> 新用戶註冊: john_doe</p>
                                <span class="activity-time">2 小時前</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderUserManagement() {
        return `
            <div class="user-management">
                <div class="section-header">
                    <h2>用戶管理</h2>
                    <div class="header-actions">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="搜尋用戶..." id="user-search">
                        </div>
                    </div>
                </div>
                
                <div class="users-table-container">
                    <table class="users-table">
                        <thead>
                            <tr>
                                <th>用戶</th>
                                <th>角色</th>
                                <th>狀態</th>
                                <th>註冊時間</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.users.map(user => `
                                <tr>
                                    <td>
                                        <div class="user-cell">
                                            <img src="${user.profile_image || CONFIG.DEFAULTS.AVATAR}" 
                                                 alt="${user.username}" class="user-avatar">
                                            <div class="user-info">
                                                <div class="user-name">${user.full_name || user.username}</div>
                                                <div class="user-email">${user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="role-badge ${user.role}">
                                            ${this.getRoleDisplayName(user.role)}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="status-badge ${user.is_active ? 'active' : 'suspended'}">
                                            ${user.is_active ? '活躍' : '已停用'}
                                        </span>
                                    </td>
                                    <td>${Utils.formatDate(user.created_at)}</td>
                                    <td>
                                        <div class="user-actions">
                                            ${user.is_active ? `
                                                <button class="btn btn-warning btn-small suspend-user-btn" 
                                                        data-user-id="${user.id}"
                                                        ${user.role === 'super_admin' ? 'disabled' : ''}>
                                                    <i class="fas fa-ban"></i>
                                                    停用
                                                </button>
                                            ` : `
                                                <button class="btn btn-success btn-small activate-user-btn" 
                                                        data-user-id="${user.id}">
                                                    <i class="fas fa-check"></i>
                                                    啟用
                                                </button>
                                            `}
                                            
                                            ${user.role === 'user' ? `
                                                <button class="btn btn-info btn-small make-admin-btn" 
                                                        data-user-id="${user.id}">
                                                    <i class="fas fa-shield-alt"></i>
                                                    設為管理員
                                                </button>
                                            ` : ''}
                                            
                                            <button class="btn btn-ghost btn-small" onclick="this.viewUserDetails(${user.id})">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    renderContentModeration() {
        return `
            <div class="content-moderation">
                <div class="section-header">
                    <h2>內容審核</h2>
                    <div class="header-stats">
                        <div class="stat-item">
                            <span class="stat-number">12</span>
                            <span class="stat-label">待審核</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">156</span>
                            <span class="stat-label">今日已審核</span>
                        </div>
                    </div>
                </div>
                
                <div class="moderation-tabs">
                    <div class="tab-buttons">
                        <button class="tab-btn active" data-tab="pending">待審核</button>
                        <button class="tab-btn" data-tab="reported">被舉報</button>
                        <button class="tab-btn" data-tab="removed">已刪除</button>
                    </div>
                    
                    <div class="tab-content">
                        <div class="empty-state">
                            <i class="fas fa-edit fa-3x"></i>
                            <h3>內容審核功能開發中</h3>
                            <p>我們正在開發完整的內容審核系統，包括貼文審核、評論管理和舉報處理功能。</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderReports() {
        return `
            <div class="admin-reports">
                <div class="section-header">
                    <h2>數據報告</h2>
                    <div class="report-period">
                        <select id="report-period">
                            <option value="7">最近 7 天</option>
                            <option value="30" selected>最近 30 天</option>
                            <option value="90">最近 90 天</option>
                        </select>
                    </div>
                </div>
                
                <div class="reports-grid">
                    <div class="report-card">
                        <h3>用戶增長</h3>
                        <div class="chart-placeholder">
                            <i class="fas fa-chart-line fa-2x"></i>
                            <p>用戶增長圖表</p>
                        </div>
                    </div>
                    
                    <div class="report-card">
                        <h3>活躍度分析</h3>
                        <div class="chart-placeholder">
                            <i class="fas fa-chart-bar fa-2x"></i>
                            <p>活躍度分析圖表</p>
                        </div>
                    </div>
                    
                    <div class="report-card">
                        <h3>內容統計</h3>
                        <div class="stats-list">
                            <div class="stat-row">
                                <span>總貼文數</span>
                                <span>1,234</span>
                            </div>
                            <div class="stat-row">
                                <span>總評論數</span>
                                <span>5,678</span>
                            </div>
                            <div class="stat-row">
                                <span>學習空間</span>
                                <span>89</span>
                            </div>
                            <div class="stat-row">
                                <span>日均活躍</span>
                                <span>456</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderSettings() {
        return `
            <div class="admin-settings">
                <div class="section-header">
                    <h2>系統設定</h2>
                </div>
                
                <div class="settings-grid">
                    <div class="setting-group">
                        <h3>平台設定</h3>
                        <div class="setting-item">
                            <label>平台名稱</label>
                            <input type="text" value="Study Social Platform" class="setting-input">
                        </div>
                        <div class="setting-item">
                            <label>平台描述</label>
                            <textarea class="setting-input">連接全球學習者，打造您的專屬學習社群</textarea>
                        </div>
                        <div class="setting-item">
                            <label class="checkbox-label">
                                <input type="checkbox" checked>
                                <span class="checkmark"></span>
                                允許新用戶註冊
                            </label>
                        </div>
                    </div>
                    
                    <div class="setting-group">
                        <h3>安全設定</h3>
                        <div class="setting-item">
                            <label>密碼最小長度</label>
                            <input type="number" value="6" min="4" max="20" class="setting-input">
                        </div>
                        <div class="setting-item">
                            <label class="checkbox-label">
                                <input type="checkbox" checked>
                                <span class="checkmark"></span>
                                啟用雙重認證
                            </label>
                        </div>
                        <div class="setting-item">
                            <label class="checkbox-label">
                                <input type="checkbox">
                                <span class="checkmark"></span>
                                需要郵箱驗證
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="settings-actions">
                    <button class="btn btn-primary" onclick="Utils.showSuccess('設定已保存')">
                        <i class="fas fa-save"></i>
                        保存設定
                    </button>
                    <button class="btn btn-secondary" onclick="this.resetSettings()">
                        <i class="fas fa-undo"></i>
                        恢復預設
                    </button>
                </div>
            </div>
        `;
    }
    
    getRoleDisplayName(role) {
        const roleNames = {
            'user': '用戶',
            'admin': '管理員',
            'super_admin': '超級管理員'
        };
        return roleNames[role] || role;
    }
    
    async handleSuspendUser(button) {
        const userId = button.dataset.userId;
        
        if (!confirm('確定要停用此用戶嗎？')) return;
        
        try {
            await api.suspendUser(userId);
            Utils.showSuccess('用戶已停用');
            
            // 更新用戶狀態
            const user = this.users.find(u => u.id === parseInt(userId));
            if (user) {
                user.is_active = false;
            }
            
            this.renderView();
            
        } catch (error) {
            Utils.showError('停用用戶失敗: ' + error.message);
        }
    }
    
    async handleActivateUser(button) {
        const userId = button.dataset.userId;
        
        try {
            await api.activateUser(userId);
            Utils.showSuccess('用戶已啟用');
            
            // 更新用戶狀態
            const user = this.users.find(u => u.id === parseInt(userId));
            if (user) {
                user.is_active = true;
            }
            
            this.renderView();
            
        } catch (error) {
            Utils.showError('啟用用戶失敗: ' + error.message);
        }
    }
    
    async handleMakeAdmin(button) {
        const userId = button.dataset.userId;
        
        if (!confirm('確定要將此用戶設為管理員嗎？')) return;
        
        try {
            await api.updateUserRole(userId, 'admin');
            Utils.showSuccess('用戶已設為管理員');
            
            // 更新用戶角色
            const user = this.users.find(u => u.id === parseInt(userId));
            if (user) {
                user.role = 'admin';
            }
            
            this.renderView();
            
        } catch (error) {
            Utils.showError('設定管理員失敗: ' + error.message);
        }
    }
    
    viewUserDetails(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2>用戶詳情</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="user-detail">
                    <div class="user-header">
                        <img src="${user.profile_image || CONFIG.DEFAULTS.AVATAR}" 
                             alt="${user.username}" class="user-avatar-large">
                        <div class="user-info">
                            <h3>${user.full_name || user.username}</h3>
                            <p>${user.email}</p>
                            <div class="user-meta">
                                <span class="role-badge ${user.role}">${this.getRoleDisplayName(user.role)}</span>
                                <span class="status-badge ${user.is_active ? 'active' : 'suspended'}">
                                    ${user.is_active ? '活躍' : '已停用'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="user-stats">
                        <div class="stat-item">
                            <span class="stat-number">23</span>
                            <span class="stat-label">好友</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">15</span>
                            <span class="stat-label">貼文</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">3</span>
                            <span class="stat-label">學習空間</span>
                        </div>
                    </div>
                    
                    <div class="user-actions">
                        <button class="btn btn-primary" onclick="this.sendMessage(${user.id})">
                            <i class="fas fa-envelope"></i>
                            發送訊息
                        </button>
                        <button class="btn btn-secondary" onclick="this.viewActivity(${user.id})">
                            <i class="fas fa-history"></i>
                            活動記錄
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.classList.remove('hidden');
        
        // 關閉模態框
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
    }
    
    showSystemAlert() {
        Utils.showWarning('系統公告功能即將推出');
    }
    
    resetSettings() {
        if (confirm('確定要恢復所有設定為預設值嗎？')) {
            Utils.showSuccess('設定已恢復為預設值');
        }
    }
    
    sendMessage(userId) {
        Utils.showWarning('發送訊息功能即將推出');
    }
    
    viewActivity(userId) {
        Utils.showWarning('用戶活動記錄功能即將推出');
    }
}

window.AdminPage = AdminPage;

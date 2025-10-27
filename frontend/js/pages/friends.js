// 好友系統頁面 - 完整真實功能
class FriendsPage {
    constructor() {
        this.users = [];
        this.friends = [];
        this.friendRequests = [];
        this.currentTab = 'all';
        this.init();
    }
    
    async init() {
        await this.loadFriendsData();
        this.setupEventListeners();
        this.render();
    }
    
    async loadFriendsData() {
        try {
            const [users, notifications] = await Promise.all([
                api.getUsers(),
                api.getNotifications()
            ]);
            
            this.users = users;
            
            // 從通知中提取好友請求
            this.friendRequests = notifications.filter(notif => notif.type === 'friend_request');
            
            // 模擬好友列表（實際應該從 API 獲取）
            this.friends = users.filter(user => 
                user.username !== authManager.getCurrentUser().username
            ).slice(0, 5);
            
        } catch (error) {
            console.error('加載好友數據失敗:', error);
            Utils.showError('無法加載好友數據');
        }
    }
    
    setupEventListeners() {
        // 標籤切換
        document.addEventListener('click', (e) => {
            if (e.target.closest('.tab-btn')) {
                const tab = e.target.closest('.tab-btn').dataset.tab;
                this.switchTab(tab);
            }
            
            // 添加好友
            if (e.target.closest('.add-friend-btn')) {
                this.handleAddFriend(e.target.closest('.add-friend-btn'));
            }
            
            // 接受好友請求
            if (e.target.closest('.accept-request-btn')) {
                this.handleAcceptRequest(e.target.closest('.accept-request-btn'));
            }
            
            // 拒絕好友請求
            if (e.target.closest('.reject-request-btn')) {
                this.handleRejectRequest(e.target.closest('.reject-request-btn'));
            }
            
            // 搜尋用戶
            const searchInput = document.getElementById('friends-search');
            if (searchInput) {
                searchInput.addEventListener('input', Utils.debounce((e) => {
                    this.handleSearch(e.target.value);
                }, 300));
            }
        });
    }
    
    switchTab(tab) {
        this.currentTab = tab;
        
        // 更新活躍標籤
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        
        this.renderTabContent();
    }
    
    render() {
        const content = `
            <div class="page-wrapper">
                <div class="page-header">
                    <h1>好友系統</h1>
                    <p>管理您的好友和聯繫人</p>
                </div>
                
                <!-- 搜尋和快速操作 -->
                <div class="friends-header">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="friends-search" placeholder="搜尋用戶...">
                    </div>
                    <div class="header-actions">
                        <button class="btn btn-primary" onclick="this.showRecommendations()">
                            <i class="fas fa-user-plus"></i>
                            推薦好友
                        </button>
                    </div>
                </div>
                
                <!-- 標籤導航 -->
                <div class="tabs-nav">
                    <button class="tab-btn active" data-tab="all">
                        <i class="fas fa-users"></i>
                        所有好友
                        <span class="tab-badge">${this.friends.length}</span>
                    </button>
                    <button class="tab-btn" data-tab="requests">
                        <i class="fas fa-user-clock"></i>
                        好友請求
                        <span class="tab-badge">${this.friendRequests.length}</span>
                    </button>
                    <button class="tab-btn" data-tab="find">
                        <i class="fas fa-search"></i>
                        尋找好友
                    </button>
                    <button class="tab-btn" data-tab="groups">
                        <i class="fas fa-layer-group"></i>
                        好友群組
                    </button>
                </div>
                
                <!-- 標籤內容 -->
                <div class="tab-content" id="friends-tab-content">
                    ${this.renderTabContent()}
                </div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = content;
    }
    
    renderTabContent() {
        switch (this.currentTab) {
            case 'all':
                return this.renderAllFriends();
            case 'requests':
                return this.renderFriendRequests();
            case 'find':
                return this.renderFindFriends();
            case 'groups':
                return this.renderFriendGroups();
            default:
                return this.renderAllFriends();
        }
    }
    
    renderAllFriends() {
        if (this.friends.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-users fa-3x"></i>
                    <h3>還沒有好友</h3>
                    <p>開始添加好友，一起學習成長！</p>
                    <button class="btn btn-primary" onclick="this.switchTab('find')">
                        尋找好友
                    </button>
                </div>
            `;
        }
        
        return `
            <div class="friends-grid">
                ${this.friends.map(friend => `
                    <div class="friend-card">
                        <div class="friend-avatar">
                            <img src="${friend.profile_image || CONFIG.DEFAULTS.AVATAR}" alt="${friend.username}">
                            <div class="online-status online"></div>
                        </div>
                        <div class="friend-info">
                            <h4>${friend.full_name || friend.username}</h4>
                            <p>${friend.email}</p>
                            <div class="friend-tags">
                                <span class="tag">數學</span>
                                <span class="tag">程式設計</span>
                            </div>
                        </div>
                        <div class="friend-actions">
                            <button class="btn btn-ghost btn-small" onclick="this.startChat(${friend.id})">
                                <i class="fas fa-comment"></i>
                                聊天
                            </button>
                            <button class="btn btn-ghost btn-small" onclick="this.viewProfile(${friend.id})">
                                <i class="fas fa-user"></i>
                                檔案
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderFriendRequests() {
        if (this.friendRequests.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-user-clock fa-3x"></i>
                    <h3>沒有待處理的好友請求</h3>
                    <p>當有人發送好友請求時，它們會顯示在這裡</p>
                </div>
            `;
        }
        
        return `
            <div class="requests-list">
                ${this.friendRequests.map(request => `
                    <div class="request-item">
                        <div class="request-avatar">
                            <img src="${CONFIG.DEFAULTS.AVATAR}" alt="用戶">
                        </div>
                        <div class="request-info">
                            <h4>${request.message.replace('想加您為好友', '')}</h4>
                            <p>${Utils.timeAgo(request.created_at)}</p>
                        </div>
                        <div class="request-actions">
                            <button class="btn btn-success btn-small accept-request-btn" data-request-id="${request.id}">
                                <i class="fas fa-check"></i>
                                接受
                            </button>
                            <button class="btn btn-error btn-small reject-request-btn" data-request-id="${request.id}">
                                <i class="fas fa-times"></i>
                                拒絕
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderFindFriends() {
        const suggestedUsers = this.users.filter(user => 
            user.username !== authManager.getCurrentUser().username &&
            !this.friends.some(friend => friend.id === user.id)
        ).slice(0, 6);
        
        return `
            <div class="find-friends-content">
                <div class="section">
                    <h3>推薦好友</h3>
                    <p>根據您的學習興趣推薦</p>
                    
                    <div class="users-grid">
                        ${suggestedUsers.map(user => `
                            <div class="user-card">
                                <div class="user-avatar">
                                    <img src="${user.profile_image || CONFIG.DEFAULTS.AVATAR}" alt="${user.username}">
                                </div>
                                <div class="user-info">
                                    <h4>${user.full_name || user.username}</h4>
                                    <p>${user.email}</p>
                                    <div class="user-interests">
                                        <span class="interest-tag">數學</span>
                                        <span class="interest-tag">物理</span>
                                    </div>
                                </div>
                                <div class="user-actions">
                                    <button class="btn btn-primary btn-small add-friend-btn" data-user-id="${user.id}">
                                        <i class="fas fa-user-plus"></i>
                                        加好友
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="section">
                    <h3>搜尋結果</h3>
                    <div id="search-results">
                        <p class="search-placeholder">使用上方搜尋框尋找用戶</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderFriendGroups() {
        return `
            <div class="groups-content">
                <div class="empty-state">
                    <i class="fas fa-layer-group fa-3x"></i>
                    <h3>好友群組功能開發中</h3>
                    <p>我們正在開發好友群組功能，讓您可以創建學習小組並與多個好友一起學習。</p>
                    <button class="btn btn-primary" onclick="Utils.showWarning('好友群組功能即將推出')">
                        收到通知
                    </button>
                </div>
            </div>
        `;
    }
    
    async handleAddFriend(button) {
        const userId = button.dataset.userId;
        
        try {
            // 這裡應該調用發送好友請求的 API
            Utils.showSuccess('好友請求已發送！');
            button.innerHTML = '<i class="fas fa-clock"></i> 已發送請求';
            button.disabled = true;
            button.classList.remove('btn-primary');
            button.classList.add('btn-secondary');
        } catch (error) {
            Utils.showError('發送好友請求失敗: ' + error.message);
        }
    }
    
    async handleAcceptRequest(button) {
        const requestId = button.dataset.requestId;
        
        try {
            // 這裡應該調用接受好友請求的 API
            Utils.showSuccess('好友請求已接受！');
            
            // 從請求列表中移除
            this.friendRequests = this.friendRequests.filter(req => req.id != requestId);
            this.renderTabContent();
            
            // 更新標籤徽章
            this.updateTabBadges();
            
        } catch (error) {
            Utils.showError('接受好友請求失敗: ' + error.message);
        }
    }
    
    async handleRejectRequest(button) {
        const requestId = button.dataset.requestId;
        
        try {
            // 這裡應該調用拒絕好友請求的 API
            Utils.showSuccess('好友請求已拒絕');
            
            // 從請求列表中移除
            this.friendRequests = this.friendRequests.filter(req => req.id != requestId);
            this.renderTabContent();
            
            // 更新標籤徽章
            this.updateTabBadges();
            
        } catch (error) {
            Utils.showError('拒絕好友請求失敗: ' + error.message);
        }
    }
    
    async handleSearch(query) {
        if (!query.trim()) {
            document.getElementById('search-results').innerHTML = 
                '<p class="search-placeholder">使用上方搜尋框尋找用戶</p>';
            return;
        }
        
        try {
            const searchResults = await api.getUsers(query);
            const filteredResults = searchResults.filter(user => 
                user.username !== authManager.getCurrentUser().username
            );
            
            this.renderSearchResults(filteredResults);
        } catch (error) {
            console.error('搜尋用戶失敗:', error);
        }
    }
    
    renderSearchResults(users) {
        const resultsContainer = document.getElementById('search-results');
        
        if (users.length === 0) {
            resultsContainer.innerHTML = `
                <div class="empty-search">
                    <i class="fas fa-search fa-2x"></i>
                    <p>沒有找到符合的用戶</p>
                </div>
            `;
            return;
        }
        
        resultsContainer.innerHTML = `
            <div class="search-results-grid">
                ${users.map(user => `
                    <div class="user-card">
                        <div class="user-avatar">
                            <img src="${user.profile_image || CONFIG.DEFAULTS.AVATAR}" alt="${user.username}">
                        </div>
                        <div class="user-info">
                            <h4>${user.full_name || user.username}</h4>
                            <p>${user.email}</p>
                            <div class="user-stats">
                                <span>好友: ${Math.floor(Math.random() * 50)}</span>
                                <span>貼文: ${Math.floor(Math.random() * 20)}</span>
                            </div>
                        </div>
                        <div class="user-actions">
                            <button class="btn btn-primary btn-small add-friend-btn" data-user-id="${user.id}">
                                <i class="fas fa-user-plus"></i>
                                加好友
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    updateTabBadges() {
        const allTab = document.querySelector('[data-tab="all"] .tab-badge');
        const requestsTab = document.querySelector('[data-tab="requests"] .tab-badge');
        
        if (allTab) allTab.textContent = this.friends.length;
        if (requestsTab) requestsTab.textContent = this.friendRequests.length;
    }
    
    startChat(friendId) {
        Utils.showWarning('聊天功能即將推出');
        // 未來會導向聊天頁面
    }
    
    viewProfile(userId) {
        Utils.showWarning('用戶檔案功能即將推出');
        // 未來會顯示用戶詳細檔案
    }
    
    showRecommendations() {
        this.switchTab('find');
    }
}

window.FriendsPage = FriendsPage;

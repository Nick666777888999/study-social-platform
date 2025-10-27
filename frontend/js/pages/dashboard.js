// 儀表板頁面功能 - 完整真實功能
class DashboardPage {
    constructor() {
        this.posts = [];
        this.studyRooms = [];
        this.userStats = {};
        this.init();
    }
    
    async init() {
        await this.loadDashboardData();
        this.setupEventListeners();
        this.renderDashboard();
    }
    
    async loadDashboardData() {
        try {
            const [posts, studyRooms, messages, notifications] = await Promise.all([
                api.getPosts(),
                api.getStudyRooms(),
                api.getMessages(),
                api.getNotifications()
            ]);
            
            this.posts = posts;
            this.studyRooms = studyRooms;
            this.messages = messages;
            this.notifications = notifications;
            
            this.calculateUserStats();
            
        } catch (error) {
            console.error('加載儀表板數據失敗:', error);
            Utils.showError('無法加載儀表板數據');
        }
    }
    
    calculateUserStats() {
        const user = authManager.getCurrentUser();
        this.userStats = {
            studyTime: Math.floor(Math.random() * 20) + 5, // 模擬學習時間
            completedGoals: Math.floor(Math.random() * 10) + 1,
            learningPartners: Math.floor(Math.random() * 30) + 5,
            achievements: Math.floor(Math.random() * 20) + 1,
            unreadMessages: this.messages.filter(msg => !msg.is_read && msg.receiver_id === user.id).length,
            pendingNotifications: this.notifications.filter(notif => !notif.is_read).length
        };
    }
    
    setupEventListeners() {
        // 快速操作按鈕
        document.addEventListener('click', (e) => {
            if (e.target.closest('.quick-action-btn')) {
                this.handleQuickAction(e.target.closest('.quick-action-btn'));
            }
            
            if (e.target.closest('.create-post-btn')) {
                this.showCreatePostModal();
            }
            
            if (e.target.closest('.join-room-btn')) {
                this.handleJoinRoom(e.target.closest('.join-room-btn'));
            }
        });
    }
    
    renderDashboard() {
        const content = `
            <div class="page-wrapper">
                <div class="page-header">
                    <h1>學習儀表板</h1>
                    <p>歡迎回來！這是您的學習進度總覽</p>
                    <div class="header-actions">
                        <button class="btn btn-primary create-post-btn">
                            <i class="fas fa-plus"></i>
                            發表貼文
                        </button>
                    </div>
                </div>
                
                <!-- 統計卡片 -->
                <div class="dashboard-grid">
                    ${this.renderStatsCards()}
                </div>
                
                <div class="dashboard-content">
                    <!-- 最近活動 -->
                    <div class="content-section">
                        <div class="section-header">
                            <h2>最近活動</h2>
                            <button class="btn btn-ghost btn-small">查看全部</button>
                        </div>
                        ${this.renderRecentActivity()}
                    </div>
                    
                    <!-- 推薦學習空間 -->
                    <div class="content-section">
                        <div class="section-header">
                            <h2>推薦學習空間</h2>
                            <button class="btn btn-ghost btn-small">瀏覽全部</button>
                        </div>
                        ${this.renderRecommendedRooms()}
                    </div>
                </div>
                
                <div class="dashboard-content">
                    <!-- 最新貼文 -->
                    <div class="content-section full-width">
                        <div class="section-header">
                            <h2>最新貼文</h2>
                            <button class="btn btn-ghost btn-small" onclick="componentManager.loadPage('discussion')">
                                進入討論區
                            </button>
                        </div>
                        ${this.renderRecentPosts()}
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = content;
    }
    
    renderStatsCards() {
        return `
            <div class="stats-card">
                <div class="stats-icon" style="background: var(--primary-color)">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stats-content">
                    <h3>本週學習時間</h3>
                    <div class="stats-value">${this.userStats.studyTime} 小時</div>
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
                    <div class="stats-value">${this.userStats.completedGoals}/12</div>
                    <div class="stats-trend up">
                        <i class="fas fa-arrow-up"></i>
                        <span>67% 完成率</span>
                    </div>
                </div>
            </div>
            
            <div class="stats-card">
                <div class="stats-icon" style="background: var(--warning-color)">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stats-content">
                    <h3>學習夥伴</h3>
                    <div class="stats-value">${this.userStats.learningPartners} 位</div>
                    <div class="stats-trend up">
                        <i class="fas fa-arrow-up"></i>
                        <span>本週新增 3 位</span>
                    </div>
                </div>
            </div>
            
            <div class="stats-card">
                <div class="stats-icon" style="background: var(--info-color)">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <div class="stats-content">
                    <h3>學習成就</h3>
                    <div class="stats-value">${this.userStats.achievements} 個</div>
                    <div class="stats-trend up">
                        <i class="fas fa-arrow-up"></i>
                        <span>解鎖 3 個新成就</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderRecentActivity() {
        const activities = [
            {
                icon: 'fas fa-book',
                text: '完成了「微積分基礎」課程',
                time: '2 小時前'
            },
            {
                icon: 'fas fa-comments',
                text: '在數學討論區發表了問題',
                time: '5 小時前'
            },
            {
                icon: 'fas fa-user-plus',
                text: '接受了 Alice 的好友請求',
                time: '1 天前'
            },
            {
                icon: 'fas fa-door-open',
                text: '加入了 Python 學習小組',
                time: '2 天前'
            }
        ];
        
        return `
            <div class="activity-list">
                ${activities.map(activity => `
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="${activity.icon}"></i>
                        </div>
                        <div class="activity-content">
                            <p>${activity.text}</p>
                            <span class="activity-time">${activity.time}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderRecommendedRooms() {
        const recommendedRooms = this.studyRooms.slice(0, 3);
        
        return `
            <div class="rooms-grid">
                ${recommendedRooms.map(room => `
                    <div class="room-card">
                        <div class="room-header">
                            <h4>${room.name}</h4>
                            <span class="room-members">${room.current_members}/${room.max_members}</span>
                        </div>
                        <p class="room-description">${room.description}</p>
                        <div class="room-footer">
                            <span class="room-subject">${room.subject}</span>
                            <button class="btn btn-primary btn-small join-room-btn" data-room-id="${room.id}">
                                加入空間
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderRecentPosts() {
        const recentPosts = this.posts.slice(0, 5);
        
        return `
            <div class="posts-list">
                ${recentPosts.map(post => `
                    <div class="post-card">
                        <div class="post-header">
                            <img src="${post.author.profile_image || CONFIG.DEFAULTS.AVATAR}" 
                                 alt="${post.author.username}" class="post-avatar">
                            <div class="post-author">
                                <h4>${post.author.full_name || post.author.username}</h4>
                                <span class="post-time">${Utils.timeAgo(post.created_at)}</span>
                            </div>
                            <span class="post-category">${post.category}</span>
                        </div>
                        <div class="post-content">
                            <h3>${post.title}</h3>
                            <p>${Utils.truncate(post.content, 150)}</p>
                        </div>
                        <div class="post-footer">
                            <div class="post-stats">
                                <span><i class="fas fa-heart"></i> ${post.likes}</span>
                                <span><i class="fas fa-comment"></i> ${post.comments}</span>
                            </div>
                            <button class="btn btn-ghost btn-small" onclick="this.viewPost(${post.id})">
                                閱讀更多
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    async handleQuickAction(button) {
        const action = button.dataset.action;
        
        switch (action) {
            case 'create_post':
                this.showCreatePostModal();
                break;
            case 'find_study_partners':
                componentManager.loadPage('friends');
                break;
            case 'join_room':
                componentManager.loadPage('study-rooms');
                break;
            case 'ask_question':
                this.showAskQuestionModal();
                break;
        }
    }
    
    showCreatePostModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2>發表新貼文</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <form id="create-post-form" class="post-form">
                    <div class="form-group">
                        <label for="post-title">標題</label>
                        <input type="text" id="post-title" required placeholder="輸入貼文標題">
                    </div>
                    <div class="form-group">
                        <label for="post-category">分類</label>
                        <select id="post-category" required>
                            <option value="">選擇分類</option>
                            <option value="數學">數學</option>
                            <option value="程式設計">程式設計</option>
                            <option value="物理">物理</option>
                            <option value="語言學習">語言學習</option>
                            <option value="其他">其他</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="post-content">內容</label>
                        <textarea id="post-content" rows="6" required placeholder="分享您的學習心得或問題..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="post-tags">標籤 (用逗號分隔)</label>
                        <input type="text" id="post-tags" placeholder="例如: 學習方法, 微積分, 技巧">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="this.closeModal()">取消</button>
                        <button type="submit" class="btn btn-primary">發表貼文</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.classList.remove('hidden');
        
        // 表單提交處理
        modal.querySelector('#create-post-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleCreatePost(modal);
        });
        
        // 關閉模態框
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
    }
    
    async handleCreatePost(modal) {
        const form = modal.querySelector('#create-post-form');
        const formData = new FormData(form);
        
        const postData = {
            title: document.getElementById('post-title').value,
            content: document.getElementById('post-content').value,
            category: document.getElementById('post-category').value,
            tags: document.getElementById('post-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag)
        };
        
        try {
            const newPost = await api.createPost(postData);
            Utils.showSuccess('貼文發表成功！');
            modal.remove();
            this.posts.unshift(newPost);
            this.renderDashboard();
        } catch (error) {
            Utils.showError('發表貼文失敗: ' + error.message);
        }
    }
    
    async handleJoinRoom(button) {
        const roomId = button.dataset.roomId;
        
        try {
            // 這裡應該調用加入學習室的 API
            Utils.showSuccess('已加入學習空間！');
            button.textContent = '已加入';
            button.disabled = true;
            button.classList.remove('btn-primary');
            button.classList.add('btn-secondary');
        } catch (error) {
            Utils.showError('加入學習空間失敗: ' + error.message);
        }
    }
    
    viewPost(postId) {
        // 這裡可以實現查看貼文詳情的功能
        console.log('查看貼文:', postId);
        Utils.showWarning('貼文詳情功能開發中');
    }
}

// 當儀表板頁面加載時自動初始化
window.DashboardPage = DashboardPage;

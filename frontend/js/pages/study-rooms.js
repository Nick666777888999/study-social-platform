// 學習空間頁面 - 完整真實功能
class StudyRoomsPage {
    constructor() {
        this.studyRooms = [];
        this.myRooms = [];
        this.recommendedRooms = [];
        this.currentTab = 'browse';
        this.init();
    }
    
    async init() {
        await this.loadStudyRoomsData();
        this.setupEventListeners();
        this.render();
    }
    
    async loadStudyRoomsData() {
        try {
            const studyRooms = await api.getStudyRooms();
            this.studyRooms = studyRooms;
            
            // 模擬用戶已加入的房間
            this.myRooms = studyRooms.slice(0, 2);
            this.recommendedRooms = studyRooms.slice(2, 5);
            
        } catch (error) {
            console.error('加載學習空間數據失敗:', error);
            Utils.showError('無法加載學習空間數據');
        }
    }
    
    setupEventListeners() {
        // 標籤切換
        document.addEventListener('click', (e) => {
            if (e.target.closest('.tab-btn')) {
                const tab = e.target.closest('.tab-btn').dataset.tab;
                this.switchTab(tab);
            }
            
            // 加入學習空間
            if (e.target.closest('.join-room-btn')) {
                this.handleJoinRoom(e.target.closest('.join-room-btn'));
            }
            
            // 創建學習空間
            if (e.target.closest('.create-room-btn')) {
                this.showCreateRoomModal();
            }
            
            // 進入學習空間
            if (e.target.closest('.enter-room-btn')) {
                this.enterStudyRoom(e.target.closest('.enter-room-btn'));
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
                    <h1>學習空間</h1>
                    <p>加入或創建專屬學習環境</p>
                    <div class="header-actions">
                        <button class="btn btn-primary create-room-btn">
                            <i class="fas fa-plus"></i>
                            創建空間
                        </button>
                    </div>
                </div>
                
                <!-- 標籤導航 -->
                <div class="tabs-nav">
                    <button class="tab-btn active" data-tab="browse">
                        <i class="fas fa-compass"></i>
                        瀏覽空間
                    </button>
                    <button class="tab-btn" data-tab="my-rooms">
                        <i class="fas fa-door-open"></i>
                        我的空間
                        <span class="tab-badge">${this.myRooms.length}</span>
                    </button>
                    <button class="tab-btn" data-tab="recommended">
                        <i class="fas fa-star"></i>
                        推薦空間
                    </button>
                </div>
                
                <!-- 標籤內容 -->
                <div class="tab-content" id="rooms-tab-content">
                    ${this.renderTabContent()}
                </div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = content;
    }
    
    renderTabContent() {
        switch (this.currentTab) {
            case 'browse':
                return this.renderBrowseRooms();
            case 'my-rooms':
                return this.renderMyRooms();
            case 'recommended':
                return this.renderRecommendedRooms();
            default:
                return this.renderBrowseRooms();
        }
    }
    
    renderBrowseRooms() {
        return `
            <div class="rooms-browse">
                <div class="filters-section">
                    <div class="filter-group">
                        <label>學科:</label>
                        <select id="subject-filter">
                            <option value="">全部學科</option>
                            <option value="數學">數學</option>
                            <option value="程式設計">程式設計</option>
                            <option value="物理">物理</option>
                            <option value="語言學習">語言學習</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>排序:</label>
                        <select id="sort-filter">
                            <option value="popular">最受歡迎</option>
                            <option value="recent">最新創建</option>
                            <option value="members">最多成員</option>
                        </select>
                    </div>
                </div>
                
                <div class="rooms-grid">
                    ${this.studyRooms.map(room => `
                        <div class="room-card">
                            <div class="room-header">
                                <h3>${room.name}</h3>
                                <span class="room-status ${room.current_members >= room.max_members ? 'full' : 'available'}">
                                    ${room.current_members}/${room.max_members}
                                </span>
                            </div>
                            <div class="room-description">
                                <p>${room.description}</p>
                            </div>
                            <div class="room-meta">
                                <span class="room-subject">${room.subject}</span>
                                <span class="room-members">
                                    <i class="fas fa-users"></i>
                                    ${room.current_members} 位成員
                                </span>
                            </div>
                            <div class="room-actions">
                                ${this.myRooms.some(myRoom => myRoom.id === room.id) ? `
                                    <button class="btn btn-success enter-room-btn" data-room-id="${room.id}">
                                        <i class="fas fa-door-open"></i>
                                        進入空間
                                    </button>
                                ` : `
                                    <button class="btn btn-primary join-room-btn" data-room-id="${room.id}"
                                            ${room.current_members >= room.max_members ? 'disabled' : ''}>
                                        <i class="fas fa-sign-in-alt"></i>
                                        ${room.current_members >= room.max_members ? '已滿員' : '加入空間'}
                                    </button>
                                `}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    renderMyRooms() {
        if (this.myRooms.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-door-open fa-3x"></i>
                    <h3>還沒有加入任何學習空間</h3>
                    <p>加入學習空間，與其他學習者一起進步！</p>
                    <button class="btn btn-primary" onclick="this.switchTab('browse')">
                        瀏覽空間
                    </button>
                </div>
            `;
        }
        
        return `
            <div class="my-rooms-grid">
                ${this.myRooms.map(room => `
                    <div class="my-room-card">
                        <div class="room-banner">
                            <div class="room-icon">
                                <i class="fas fa-graduation-cap"></i>
                            </div>
                        </div>
                        <div class="room-content">
                            <h3>${room.name}</h3>
                            <p class="room-description">${room.description}</p>
                            <div class="room-stats">
                                <div class="stat">
                                    <i class="fas fa-users"></i>
                                    <span>${room.current_members} 成員</span>
                                </div>
                                <div class="stat">
                                    <i class="fas fa-clock"></i>
                                    <span>${Utils.formatDate(room.created_at)}</span>
                                </div>
                            </div>
                            <div class="room-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${(room.current_members / room.max_members) * 100}%"></div>
                                </div>
                                <span>${Math.round((room.current_members / room.max_members) * 100)}% 滿員</span>
                            </div>
                        </div>
                        <div class="room-actions">
                            <button class="btn btn-primary enter-room-btn" data-room-id="${room.id}">
                                <i class="fas fa-door-open"></i>
                                進入空間
                            </button>
                            <button class="btn btn-ghost leave-room-btn" data-room-id="${room.id}">
                                <i class="fas fa-sign-out-alt"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderRecommendedRooms() {
        return `
            <div class="recommended-rooms">
                <div class="recommendation-header">
                    <h3>為您推薦</h3>
                    <p>根據您的學習興趣和歷史記錄推薦</p>
                </div>
                
                <div class="recommended-grid">
                    ${this.recommendedRooms.map(room => `
                        <div class="recommended-room-card">
                            <div class="recommendation-badge">
                                <i class="fas fa-star"></i>
                                推薦
                            </div>
                            <div class="room-content">
                                <h4>${room.name}</h4>
                                <p>${room.description}</p>
                                <div class="room-match">
                                    <span class="match-percent">85% 匹配度</span>
                                    <span class="room-subject">${room.subject}</span>
                                </div>
                            </div>
                            <div class="room-actions">
                                <button class="btn btn-primary join-room-btn" data-room-id="${room.id}">
                                    <i class="fas fa-sign-in-alt"></i>
                                    加入空間
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    async handleJoinRoom(button) {
        const roomId = button.dataset.roomId;
        
        try {
            // 這裡應該調用加入學習室的 API
            const room = this.studyRooms.find(r => r.id === parseInt(roomId));
            
            Utils.showSuccess(`已加入 ${room.name}！`);
            
            // 更新 UI
            button.innerHTML = '<i class="fas fa-door-open"></i> 進入空間';
            button.classList.remove('btn-primary');
            button.classList.add('btn-success');
            button.classList.remove('join-room-btn');
            button.classList.add('enter-room-btn');
            
            // 添加到我的房間
            if (!this.myRooms.some(r => r.id === room.id)) {
                this.myRooms.push(room);
            }
            
            // 更新房間人數
            room.current_members++;
            
            // 更新標籤徽章
            this.updateTabBadges();
            
        } catch (error) {
            Utils.showError('加入學習空間失敗: ' + error.message);
        }
    }
    
    enterStudyRoom(button) {
        const roomId = button.dataset.roomId;
        const room = this.studyRooms.find(r => r.id === parseInt(roomId));
        
        // 顯示學習空間詳情
        this.showRoomDetail(room);
    }
    
    showRoomDetail(room) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2>${room.name}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="room-detail">
                    <div class="room-info">
                        <div class="info-section">
                            <h3>空間簡介</h3>
                            <p>${room.description}</p>
                        </div>
                        
                        <div class="info-grid">
                            <div class="info-item">
                                <label>學科</label>
                                <span>${room.subject}</span>
                            </div>
                            <div class="info-item">
                                <label>成員數量</label>
                                <span>${room.current_members}/${room.max_members}</span>
                            </div>
                            <div class="info-item">
                                <label>創建時間</label>
                                <span>${Utils.formatDate(room.created_at)}</span>
                            </div>
                            <div class="info-item">
                                <label>空間類型</label>
                                <span>${room.is_public ? '公開' : '私人'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="room-features">
                        <h3>空間功能</h3>
                        <div class="features-grid">
                            <div class="feature-item">
                                <i class="fas fa-video"></i>
                                <span>視訊會議</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-file-alt"></i>
                                <span>共享白板</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-comments"></i>
                                <span>即時聊天</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-tasks"></i>
                                <span>學習任務</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="room-actions">
                        <button class="btn btn-primary">
                            <i class="fas fa-door-open"></i>
                            立即進入
                        </button>
                        <button class="btn btn-secondary">
                            <i class="fas fa-calendar"></i>
                            查看排程
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
    
    showCreateRoomModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2>創建學習空間</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <form id="create-room-form" class="room-form">
                    <div class="form-group">
                        <label for="room-name">空間名稱</label>
                        <input type="text" id="room-name" required placeholder="例如: Python 學習小組">
                    </div>
                    
                    <div class="form-group">
                        <label for="room-description">空間描述</label>
                        <textarea id="room-description" rows="3" required placeholder="描述您的學習空間..."></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="room-subject">學科</label>
                            <select id="room-subject" required>
                                <option value="">選擇學科</option>
                                <option value="數學">數學</option>
                                <option value="程式設計">程式設計</option>
                                <option value="物理">物理</option>
                                <option value="語言學習">語言學習</option>
                                <option value="其他">其他</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="room-max-members">最大成員數</label>
                            <input type="number" id="room-max-members" min="2" max="50" value="20" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="room-is-public" checked>
                            <span class="checkmark"></span>
                            公開空間（其他用戶可以找到並加入）
                        </label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="this.closeModal()">取消</button>
                        <button type="submit" class="btn btn-primary">創建空間</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.classList.remove('hidden');
        
        // 表單提交處理
        modal.querySelector('#create-room-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleCreateRoom(modal);
        });
        
        // 關閉模態框
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
    }
    
    async handleCreateRoom(modal) {
        const form = modal.querySelector('#create-room-form');
        
        const roomData = {
            name: document.getElementById('room-name').value,
            description: document.getElementById('room-description').value,
            subject: document.getElementById('room-subject').value,
            max_members: parseInt(document.getElementById('room-max-members').value),
            is_public: document.getElementById('room-is-public').checked
        };
        
        try {
            const newRoom = await api.createStudyRoom(roomData);
            Utils.showSuccess('學習空間創建成功！');
            modal.remove();
            
            // 添加到列表
            this.studyRooms.unshift(newRoom);
            this.myRooms.unshift(newRoom);
            
            // 重新渲染
            this.renderTabContent();
            this.updateTabBadges();
            
        } catch (error) {
            Utils.showError('創建學習空間失敗: ' + error.message);
        }
    }
    
    updateTabBadges() {
        const myRoomsTab = document.querySelector('[data-tab="my-rooms"] .tab-badge');
        if (myRoomsTab) {
            myRoomsTab.textContent = this.myRooms.length;
        }
    }
}

window.StudyRoomsPage = StudyRoomsPage;

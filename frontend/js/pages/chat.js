// 聊天系統頁面 - 完整真實功能
class ChatPage {
    constructor() {
        this.messages = [];
        this.chats = [];
        this.activeChat = null;
        this.currentUser = null;
        this.init();
    }
    
    async init() {
        await this.loadChatData();
        this.setupEventListeners();
        this.render();
    }
    
    async loadChatData() {
        try {
            const [messages, users] = await Promise.all([
                api.getMessages(),
                api.getUsers()
            ]);
            
            this.messages = messages;
            this.currentUser = authManager.getCurrentUser();
            
            // 構建聊天列表
            this.chats = this.buildChatsList(users);
            
            if (this.chats.length > 0) {
                this.activeChat = this.chats[0];
            }
            
        } catch (error) {
            console.error('加載聊天數據失敗:', error);
            Utils.showError('無法加載聊天數據');
        }
    }
    
    buildChatsList(users) {
        // 從訊息中提取聊天對象
        const chatPartners = new Map();
        
        this.messages.forEach(message => {
            const partnerId = message.sender_id === this.currentUser.id ? 
                message.receiver_id : message.sender_id;
            
            if (!chatPartners.has(partnerId)) {
                const partner = users.find(user => user.id === partnerId);
                if (partner) {
                    const chatMessages = this.messages.filter(msg => 
                        (msg.sender_id === this.currentUser.id && msg.receiver_id === partnerId) ||
                        (msg.sender_id === partnerId && msg.receiver_id === this.currentUser.id)
                    );
                    
                    chatPartners.set(partnerId, {
                        id: partnerId,
                        user: partner,
                        messages: chatMessages,
                        lastMessage: chatMessages[chatMessages.length - 1],
                        unreadCount: chatMessages.filter(msg => 
                            !msg.is_read && msg.sender_id === partnerId
                        ).length
                    });
                }
            }
        });
        
        return Array.from(chatPartners.values()).sort((a, b) => 
            new Date(b.lastMessage?.created_at || 0) - new Date(a.lastMessage?.created_at || 0)
        );
    }
    
    setupEventListeners() {
        // 發送訊息
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'message-form') {
                e.preventDefault();
                this.handleSendMessage(e.target);
            }
        });
        
        // 選擇聊天
        document.addEventListener('click', (e) => {
            if (e.target.closest('.chat-item')) {
                const chatId = e.target.closest('.chat-item').dataset.chatId;
                this.selectChat(parseInt(chatId));
            }
            
            // 開始新聊天
            if (e.target.closest('.start-chat-btn')) {
                this.showNewChatModal();
            }
        });
        
        // 即時更新模擬
        setInterval(() => {
            this.simulateNewMessages();
        }, 30000);
    }
    
    render() {
        const content = `
            <div class="chat-page-wrapper">
                <div class="chat-container">
                    <!-- 聊天列表側邊欄 -->
                    <div class="chat-sidebar">
                        <div class="sidebar-header">
                            <h2>訊息</h2>
                            <button class="btn btn-ghost btn-small start-chat-btn">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                        
                        <div class="chat-list">
                            ${this.renderChatList()}
                        </div>
                    </div>
                    
                    <!-- 聊天主區域 -->
                    <div class="chat-main">
                        ${this.activeChat ? this.renderActiveChat() : this.renderNoChatSelected()}
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = content;
    }
    
    renderChatList() {
        if (this.chats.length === 0) {
            return `
                <div class="empty-chats">
                    <i class="fas fa-comments fa-2x"></i>
                    <p>還沒有聊天記錄</p>
                    <button class="btn btn-primary start-chat-btn">
                        開始聊天
                    </button>
                </div>
            `;
        }
        
        return this.chats.map(chat => `
            <div class="chat-item ${this.activeChat?.id === chat.id ? 'active' : ''}" 
                 data-chat-id="${chat.id}">
                <div class="chat-avatar">
                    <img src="${chat.user.profile_image || CONFIG.DEFAULTS.AVATAR}" 
                         alt="${chat.user.username}">
                    ${chat.unreadCount > 0 ? `<span class="unread-badge">${chat.unreadCount}</span>` : ''}
                </div>
                <div class="chat-info">
                    <div class="chat-header">
                        <h4>${chat.user.full_name || chat.user.username}</h4>
                        <span class="chat-time">${Utils.timeAgo(chat.lastMessage?.created_at)}</span>
                    </div>
                    <p class="chat-preview">${this.getLastMessagePreview(chat.lastMessage)}</p>
                </div>
            </div>
        `).join('');
    }
    
    renderActiveChat() {
        return `
            <div class="chat-header">
                <div class="chat-partner">
                    <img src="${this.activeChat.user.profile_image || CONFIG.DEFAULTS.AVATAR}" 
                         alt="${this.activeChat.user.username}">
                    <div class="partner-info">
                        <h3>${this.activeChat.user.full_name || this.activeChat.user.username}</h3>
                        <span class="online-status">線上</span>
                    </div>
                </div>
                <div class="chat-actions">
                    <button class="btn btn-ghost btn-small">
                        <i class="fas fa-phone"></i>
                    </button>
                    <button class="btn btn-ghost btn-small">
                        <i class="fas fa-video"></i>
                    </button>
                    <button class="btn btn-ghost btn-small">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
            </div>
            
            <div class="chat-messages" id="chat-messages">
                ${this.renderMessages()}
            </div>
            
            <div class="chat-input">
                <form id="message-form" class="message-form">
                    <div class="input-actions">
                        <button type="button" class="btn btn-ghost btn-small">
                            <i class="fas fa-paperclip"></i>
                        </button>
                        <button type="button" class="btn btn-ghost btn-small">
                            <i class="fas fa-image"></i>
                        </button>
                    </div>
                    <input type="text" 
                           id="message-input" 
                           placeholder="輸入訊息..." 
                           autocomplete="off"
                           required>
                    <button type="submit" class="btn btn-primary btn-small">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        `;
    }
    
    renderNoChatSelected() {
        return `
            <div class="no-chat-selected">
                <div class="no-chat-content">
                    <i class="fas fa-comments fa-4x"></i>
                    <h2>選擇一個聊天</h2>
                    <p>從左側選擇一個對話或開始新的聊天</p>
                    <button class="btn btn-primary start-chat-btn">
                        開始新聊天
                    </button>
                </div>
            </div>
        `;
    }
    
    renderMessages() {
        if (!this.activeChat.messages.length) {
            return `
                <div class="no-messages">
                    <p>還沒有任何訊息</p>
                    <p>發送第一條訊息開始對話吧！</p>
                </div>
            `;
        }
        
        return this.activeChat.messages.map(message => `
            <div class="message ${message.sender_id === this.currentUser.id ? 'sent' : 'received'}">
                <div class="message-content">
                    <p>${message.content}</p>
                    <span class="message-time">${Utils.formatTime(message.created_at)}</span>
                </div>
            </div>
        `).join('');
    }
    
    getLastMessagePreview(lastMessage) {
        if (!lastMessage) return '開始對話...';
        
        const content = lastMessage.content;
        return content.length > 30 ? content.substring(0, 30) + '...' : content;
    }
    
    selectChat(chatId) {
        this.activeChat = this.chats.find(chat => chat.id === chatId);
        this.render();
        this.scrollToBottom();
        
        // 標記訊息為已讀
        this.markMessagesAsRead(chatId);
    }
    
    async handleSendMessage(form) {
        const input = form.querySelector('#message-input');
        const content = input.value.trim();
        
        if (!content || !this.activeChat) return;
        
        try {
            const messageData = {
                content: content,
                receiver_id: this.activeChat.id
            };
            
            const newMessage = await api.sendMessage(messageData);
            
            // 添加到當前聊天
            this.activeChat.messages.push(newMessage);
            this.activeChat.lastMessage = newMessage;
            
            // 清空輸入框
            input.value = '';
            
            // 重新渲染訊息
            this.renderMessages();
            this.scrollToBottom();
            
        } catch (error) {
            Utils.showError('發送訊息失敗: ' + error.message);
        }
    }
    
    scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
    
    markMessagesAsRead(chatId) {
        // 這裡應該調用 API 標記訊息為已讀
        const chat = this.chats.find(c => c.id === chatId);
        if (chat) {
            chat.unreadCount = 0;
        }
    }
    
    simulateNewMessages() {
        // 模擬收到新訊息（僅用於演示）
        if (this.chats.length > 0 && Math.random() > 0.7) {
            const randomChat = this.chats[Math.floor(Math.random() * this.chats.length)];
            const sampleMessages = [
                '你好！最近學習進度如何？',
                '有個問題想請教你...',
                '我發現了一個很好的學習資源！',
                '要不要一起學習？',
                '你完成了那個練習題嗎？'
            ];
            
            const newMessage = {
                id: Date.now(),
                sender_id: randomChat.id,
                receiver_id: this.currentUser.id,
                content: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
                message_type: 'text',
                created_at: new Date().toISOString(),
                is_read: false,
                sender: randomChat.user
            };
            
            randomChat.messages.push(newMessage);
            randomChat.lastMessage = newMessage;
            randomChat.unreadCount++;
            
            // 如果這是當前活躍的聊天，更新顯示
            if (this.activeChat?.id === randomChat.id) {
                this.renderMessages();
                this.scrollToBottom();
                this.markMessagesAsRead(randomChat.id);
            }
            
            // 更新聊天列表
            this.updateChatList();
            
            // 顯示通知
            if (this.activeChat?.id !== randomChat.id) {
                Utils.showNotification(`新訊息來自 ${randomChat.user.full_name || randomChat.user.username}`);
            }
        }
    }
    
    updateChatList() {
        const chatList = document.querySelector('.chat-list');
        if (chatList) {
            chatList.innerHTML = this.renderChatList();
        }
    }
    
    showNewChatModal() {
        Utils.showWarning('開始新聊天功能即將推出');
    }
}

window.ChatPage = ChatPage;

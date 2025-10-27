// 應用配置
const CONFIG = {
    // API 基礎 URL
    API_BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:8000' 
        : 'https://your-backend-domain.vercel.app',
    
    // 應用設定
    APP: {
        NAME: 'Study Social Platform',
        VERSION: '2.0.0',
        DESCRIPTION: '智慧學習社交平台'
    },
    
    // 功能開關
    FEATURES: {
        REAL_TIME_CHAT: true,
        VOICE_MESSAGES: true,
        FILE_SHARING: true,
        VIDEO_CALLS: false, // 即將推出
        SCREEN_SHARING: false, // 即將推出
        AI_ASSISTANT: true
    },
    
    // 主題設定
    THEME: {
        PRIMARY_COLOR: '#667eea',
        SECONDARY_COLOR: '#764ba2',
        ACCENT_COLOR: '#f093fb',
        DARK_MODE: false
    },
    
    // 本地儲存金鑰
    STORAGE_KEYS: {
        AUTH_TOKEN: 'study_social_token',
        USER_DATA: 'study_social_user',
        THEME_PREFERENCE: 'study_social_theme',
        LANGUAGE: 'study_social_lang'
    },
    
    // 預設設定
    DEFAULTS: {
        AVATAR: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
        LANGUAGE: 'zh-TW',
        PAGE_SIZE: 20,
        NOTIFICATION_SOUND: true
    },
    
    // 錯誤訊息
    ERROR_MESSAGES: {
        NETWORK_ERROR: '網路連接失敗，請檢查您的網路設定',
        UNAUTHORIZED: '請先登入以繼續使用',
        FORBIDDEN: '您沒有權限執行此操作',
        NOT_FOUND: '請求的資源不存在',
        SERVER_ERROR: '伺服器發生錯誤，請稍後再試',
        VALIDATION_ERROR: '請檢查輸入的資料是否正確'
    },
    
    // 成功訊息
    SUCCESS_MESSAGES: {
        LOGIN_SUCCESS: '登入成功！',
        REGISTER_SUCCESS: '註冊成功！歡迎加入學習社群',
        UPDATE_SUCCESS: '更新成功',
        DELETE_SUCCESS: '刪除成功',
        SEND_SUCCESS: '傳送成功'
    },
    
    // 動畫設定
    ANIMATION: {
        DURATION: {
            FAST: 150,
            NORMAL: 300,
            SLOW: 500
        },
        EASING: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
};

// 功能模組定義
const MODULES = {
    DASHBOARD: 'dashboard',
    FRIENDS: 'friends',
    CHAT: 'chat',
    STUDY_ROOMS: 'study-rooms',
    DISCUSSION: 'discussion',
    RESOURCES: 'resources',
    AI_ASSISTANT: 'ai-assistant',
    EVENTS: 'events',
    GROUPS: 'groups',
    ADMIN_DASHBOARD: 'admin-dashboard',
    USER_MANAGEMENT: 'user-management',
    CONTENT_MODERATION: 'content-moderation'
};

// 用戶角色
const USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin'
};

// 通知類型
const NOTIFICATION_TYPES = {
    FRIEND_REQUEST: 'friend_request',
    MESSAGE: 'message',
    POST_LIKE: 'post_like',
    POST_COMMENT: 'post_comment',
    STUDY_ROOM_INVITE: 'study_room_invite',
    EVENT_REMINDER: 'event_reminder',
    SYSTEM: 'system'
};

// 匯出到全域
window.CONFIG = CONFIG;
window.MODULES = MODULES;
window.USER_ROLES = USER_ROLES;
window.NOTIFICATION_TYPES = NOTIFICATION_TYPES;

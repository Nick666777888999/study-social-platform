// 應用配置 - 使用真實後端
const CONFIG = {
    // API 基礎 URL - 根據環境自動設定
    API_BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:8000' 
        : window.location.origin.replace('study-social-platform', 'study-social-platform-api'),
    
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
        VIDEO_CALLS: false,
        SCREEN_SHARING: false,
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
    }
};

// 匯出到全域
window.CONFIG = CONFIG;

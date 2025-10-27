// 發光跟隨按鈕效果
class GlowingButtons {
    constructor() {
        this.buttons = [];
        this.init();
    }
    
    init() {
        this.setupButtons();
        this.setupEventListeners();
    }
    
    setupButtons() {
        const buttons = document.querySelectorAll('.glowing-btn');
        this.buttons = Array.from(buttons);
        
        this.buttons.forEach(btn => {
            // 初始化位置變數
            btn.style.setProperty('--x', '50%');
            btn.style.setProperty('--y', '50%');
        });
    }
    
    setupEventListeners() {
        // 滑鼠移動事件
        document.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });
        
        // 觸控設備支持
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.handleMouseMove(touch);
            }
        });
        
        // 視窗大小改變時重新計算
        window.addEventListener('resize', () => {
            this.setupButtons();
        });
    }
    
    handleMouseMove(e) {
        this.buttons.forEach(btn => {
            if (this.isElementInViewport(btn)) {
                this.updateButtonGlow(btn, e);
            }
        });
    }
    
    updateButtonGlow(button, event) {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        button.style.setProperty('--x', `${x}px`);
        button.style.setProperty('--y', `${y}px`);
    }
    
    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // 添加新的發光按鈕
    addButton(button) {
        if (button.classList.contains('glowing-btn')) {
            this.buttons.push(button);
            button.style.setProperty('--x', '50%');
            button.style.setProperty('--y', '50%');
        }
    }
    
    // 移除按鈕
    removeButton(button) {
        const index = this.buttons.indexOf(button);
        if (index > -1) {
            this.buttons.splice(index, 1);
        }
    }
    
    // 啟用/禁用效果
    enable() {
        this.setupEventListeners();
    }
    
    disable() {
        // 移除事件監聽器
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('touchmove', this.handleMouseMove);
    }
}

// 初始化發光按鈕效果
document.addEventListener('DOMContentLoaded', () => {
    window.glowingButtons = new GlowingButtons();
});

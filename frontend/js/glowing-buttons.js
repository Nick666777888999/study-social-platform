// 發光跟隨按鈕效果
document.addEventListener('DOMContentLoaded', function() {
    const glowingBtns = document.querySelectorAll('.glowing-btn');
    
    document.addEventListener('mousemove', function(e) {
        glowingBtns.forEach(btn => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            btn.style.setProperty('--x', x + 'px');
            btn.style.setProperty('--y', y + 'px');
        });
    });
});

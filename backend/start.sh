#!/bin/bash
echo "🚀 啟動 Study Social Platform 後端服務"
echo "📝 管理員帳號: Nick20130104"
echo "🔑 管理員密碼: admin123"

# 安裝依賴
pip install -r requirements.txt

# 啟動服務
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

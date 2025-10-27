from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from typing import List, Optional
from datetime import datetime, timedelta
import os
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv

# 加載環境變數
load_dotenv()

# 密碼加密
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI(
    title="Study Social Platform API",
    description="完整的學習社交平台後端 API",
    version="2.0.0"
)

# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生產環境中應該限制為具體域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# 從環境變數獲取 JWT 設定
SECRET_KEY = os.environ.get("JWT_SECRET", "fallback-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# 其餘的代碼保持不變...
# [這裡插入之前的所有後端代碼]

# 在文件末尾添加
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

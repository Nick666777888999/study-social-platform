from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from typing import List
import os
from dotenv import load_dotenv

from .models import *
from .database import db
from .auth import *

load_dotenv()

app = FastAPI(
    title="Study Social Platform API",
    description="完整的學習社交平台後端 API",
    version="2.0.0"
)

# CORS 中間件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# 模擬資料儲存（在生產環境中應該使用資料庫）
users_db = {}
posts_db = []
messages_db = []
friend_requests_db = []
study_rooms_db = []

# 初始化管理員用戶
def init_admin_user():
    admin_user = {
        "id": 1,
        "username": "Nick20130104",
        "email": "admin@studysocial.com",
        "full_name": "Super Administrator",
        "password_hash": get_password_hash("admin123"),
        "role": UserRole.SUPER_ADMIN,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "profile_image": None
    }
    users_db[1] = admin_user

# 初始化範例數據
def init_sample_data():
    # 範例用戶
    sample_users = [
        {
            "id": 2,
            "username": "alice_learn",
            "email": "alice@example.com",
            "full_name": "Alice Johnson",
            "password_hash": get_password_hash("password123"),
            "role": UserRole.USER,
            "is_active": True,
            "created_at": datetime.utcnow(),
            "profile_image": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
        },
        {
            "id": 3,
            "username": "bob_study",
            "email": "bob@example.com",
            "full_name": "Bob Smith",
            "password_hash": get_password_hash("password123"),
            "role": UserRole.USER,
            "is_active": True,
            "created_at": datetime.utcnow(),
            "profile_image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
        }
    ]
    
    for user in sample_users:
        users_db[user["id"]] = user
    
    # 範例貼文
    global posts_db
    posts_db = [
        {
            "id": 1,
            "title": "數學學習心得分享",
            "content": "最近在學習微積分，發現了一些很好的學習方法...",
            "author": users_db[2],
            "category": "數學",
            "tags": ["微積分", "學習方法"],
            "likes": 15,
            "comments": 3,
            "created_at": datetime.utcnow()
        },
        {
            "id": 2,
            "title": "程式設計學習資源推薦",
            "content": "推薦幾個學習 Python 的好網站...",
            "author": users_db[3],
            "category": "程式設計",
            "tags": ["Python", "學習資源"],
            "likes": 23,
            "comments": 7,
            "created_at": datetime.utcnow()
        }
    ]
    
    # 範例學習室
    global study_rooms_db
    study_rooms_db = [
        {
            "id": 1,
            "name": "數學高手集中營",
            "description": "專注於高等數學學習",
            "subject": "數學",
            "current_members": 8,
            "max_members": 20,
            "is_public": True,
            "created_at": datetime.utcnow()
        },
        {
            "id": 2,
            "name": "Python 學習小組",
            "description": "從零開始學 Python",
            "subject": "程式設計",
            "current_members": 15,
            "max_members": 30,
            "is_public": True,
            "created_at": datetime.utcnow()
        }
    ]

# 啟動時初始化數據
@app.on_event("startup")
async def startup_event():
    init_admin_user()
    init_sample_data()

# 依賴項：獲取當前用戶
async def get_current_user(token: str = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_token(token.credentials)
    if payload is None:
        raise credentials_exception
    
    username: str = payload.get("sub")
    if username is None:
        raise credentials_exception
    
    user = None
    for u in users_db.values():
        if u["username"] == username:
            user = u
            break
    
    if user is None:
        raise credentials_exception
    
    return UserResponse(**user)

# 身份驗證路由
@app.post("/api/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    # 檢查用戶名是否已存在
    for user in users_db.values():
        if user["username"] == user_data.username:
            raise HTTPException(
                status_code=400,
                detail="Username already registered"
            )
        if user["email"] == user_data.email:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
    
    # 創建新用戶
    user_id = max(users_db.keys()) + 1 if users_db else 1
    user_dict = {
        "id": user_id,
        "username": user_data.username,
        "email": user_data.email,
        "full_name": user_data.full_name,
        "password_hash": get_password_hash(user_data.password),
        "role": UserRole.USER,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "profile_image": None
    }
    
    users_db[user_id] = user_dict
    return UserResponse(**user_dict)

@app.post("/api/login", response_model=Token)
async def login(login_data: UserLogin):
    user = None
    for u in users_db.values():
        if u["username"] == login_data.username:
            user = u
            break
    
    if not user or not verify_password(login_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": user["username"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(**user)
    )

# 用戶路由
@app.get("/api/users/me", response_model=UserResponse)
async def read_users_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user

@app.get("/api/users", response_model=List[UserResponse])
async def get_users(search: str = "", current_user: UserResponse = Depends(get_current_user)):
    users = [UserResponse(**user) for user in users_db.values()]
    if search:
        users = [user for user in users if search.lower() in user.username.lower() or 
                (user.full_name and search.lower() in user.full_name.lower())]
    return users

# 貼文路由
@app.get("/api/posts", response_model=List[Post])
async def get_posts(category: str = "", current_user: UserResponse = Depends(get_current_user)):
    posts = posts_db
    if category:
        posts = [post for post in posts if post["category"] == category]
    return posts

@app.post("/api/posts", response_model=Post)
async def create_post(post: Post, current_user: UserResponse = Depends(get_current_user)):
    post_id = max([p["id"] for p in posts_db]) + 1 if posts_db else 1
    post_dict = {
        "id": post_id,
        "title": post.title,
        "content": post.content,
        "author": current_user.dict(),
        "category": post.category,
        "tags": post.tags,
        "likes": 0,
        "comments": 0,
        "created_at": datetime.utcnow()
    }
    posts_db.append(post_dict)
    return Post(**post_dict)

# 學習室路由
@app.get("/api/study-rooms", response_model=List[StudyRoom])
async def get_study_rooms(subject: str = "", current_user: UserResponse = Depends(get_current_user)):
    rooms = study_rooms_db
    if subject:
        rooms = [room for room in rooms if room["subject"] == subject]
    return rooms

# 管理員路由
@app.get("/api/admin/users", response_model=List[UserResponse])
async def get_all_users(current_user: UserResponse = Depends(get_current_user)):
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return [UserResponse(**user) for user in users_db.values()]

@app.get("/")
async def root():
    return {"message": "Study Social Platform API", "version": "2.0.0"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

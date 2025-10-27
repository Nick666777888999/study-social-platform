import uvicorn
import os
from dotenv import load_dotenv

# 加載環境變數
load_dotenv()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=os.environ.get("DEBUG", "False").lower() == "true"
    )

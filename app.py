import os
import uvicorn
from fastapi import FastAPI

app = FastAPI()

# ... (你的 API 路由代码，比如 @app.post("/predict") 等) ...

if __name__ == '__main__':
    print("========================================")
    print("🚀 FastAPI Server started. Waiting for Web Frontend requests...")
    print("========================================")

    # 动态获取 Render 提供的端口，如果在本地运行，默认使用 5000
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)

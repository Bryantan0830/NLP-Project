import os
import uvicorn
from fastapi import FastAPI

app = FastAPI()

# 示例路由：你可以把你的模型预测逻辑写在这里
@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI on Render!"}

if __name__ == '__main__':
    print("========================================")
    print("🚀 FastAPI Server started. Waiting for Web Frontend requests...")
    print("========================================")

    # 动态获取 Render 提供的端口，如果在本地运行，默认使用 5000
    port = int(os.environ.get("PORT", 5000))
    # 注意：host 必须是 "0.0.0.0" 才能在 Render 上被外部访问
    uvicorn.run(app, host="0.0.0.0", port=port)

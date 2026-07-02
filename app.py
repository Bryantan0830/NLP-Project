import os
from flask import Flask
app = Flask(__name__)


if __name__ == '__main__':
    print("========================================")
    print("🚀 Flask Server started. Waiting for Web Frontend requests...")
    print("========================================")

    # 动态获取 Render 提供的端口，如果在本地运行，默认使用 5000
    port = int(os.environ.get("PORT", 5000))
    app.run(host="[IP_ADDRESS]", port=port)

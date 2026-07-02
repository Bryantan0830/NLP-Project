import os
from flask import Flask
app = Flask(__name__)


if __name__ == '__main__':
    print("========================================")
    print("🚀 Flask Server started. Waiting for Web Frontend requests...")
    print("========================================")

    @app.route('/api/chat', methods = ['post'])
    def predict():
        return

    port = int(os.environ.get("PORT", 5000))
    app.run(host="[IP_ADDRESS]", port=port)

# alternator app.run??



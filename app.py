from Flask import request
import os
from flask import Flask
app = Flask(__name__)

@app.route('/api/chat', methods = ['post'])
def predict():
    data = request.json
    user_input = data.get('input')
    if user_input:
        return {"response": user_input}
    else:
        return {"response": "No input received"}

if __name__ == '__main__':
    print("========================================")
    print("🚀 Flask Server started. Waiting for Web Frontend requests...")
    print("========================================")

    port = int(os.environ.get("PORT", 5000))
    app.run(host="[IP_ADDRESS]", port=port)

# alternator app.run??



from flask import Flask, request
import os

app = Flask(__name__)

@app.route('/api/chat', methods=['GET', 'POST'])
def predict():

    if request.method == 'GET':
        return {"status": "API is working"}

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
    app.run(host="0.0.0.0", port=port)

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/save_messages', methods=['POST'])
def save_messages():
    try:
        data = request.get_json()
        messages = data.get('messages', [])

        # Do something with the messages, e.g., save them to a database or process them
        print(messages)

        return jsonify({"message": "Messages saved successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='localhost', port=8000)

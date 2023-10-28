from flask import Flask, request, jsonify
from flask_cors import CORS
from keras.models import load_model
import json

app = Flask(__name__)
CORS(app)

# Load the Keras model
model_final = load_model('C:/Users/VaishakhRaveendran/Desktop/Sandstorm/model/model.tf')

@app.route('/save_messages', methods=['POST'])
def save_messages():
    try:
        data = request.get_json()
        messages = data.get('messages', [])

        
        text_data = [message['text'] for message in messages]

        Emotions = ['sadness', 'joy', 'love', 'anger', 'fear', 'Surprise']
        print(text_data[-1])
        Scores = model_final.predict(list(text_data[-1]))
        Card = {}
        for scores, emotion in zip(Scores[0], Emotions):
            Card[emotion] = str(scores) 

    
        print(Card)
        return jsonify({"predictions": Card})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='localhost', port=8000)

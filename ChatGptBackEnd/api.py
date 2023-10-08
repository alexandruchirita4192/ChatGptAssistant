from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import openai
import os

# from dotenv import load_dotenv, find_dotenv
# _ = load_dotenv(find_dotenv())

openai.api_key = os.getenv('api_key')


def get_completion(prompt, model="gpt-3.5-turbo", temperature=0):
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=temperature,  # this is the degree of randomness of the model's output
    )
    return response.choices[0].message["content"]


app = Flask(__name__)
# CORS(app)
CORS(app, origins=['http://localhost:8100'])
# , 'http://myproductiondomain.com'])

# Load existing history from disk if available
try:
    with open('history.json', 'r') as f:
        history = json.load(f)
except FileNotFoundError:
    history = []


@app.route('/keys', methods=['GET'])
def get_keys():
    with open('../data.json', 'r') as f:
        data = json.load(f)
    return jsonify(list(data.keys()))


@app.route('/endpoint', methods=['POST'])
def handle_text():
    # Get parameters received by endpoint
    key = request.json['key']
    text = request.json['text']

    # Open file with key and value pairs in JSON format
    with open('../data.json', 'r') as f:
        data = json.load(f)

    # Get value associated to the selected key in combobox
    value = data.get(key, '')

    # Compute the prompt based on selected value and the current text
    prompt = value.replace("{text}", text)

    # Process response using ChatGPT
    response = get_completion(prompt)

    # Save to history
    history_item = {
        'key': key,
        'text': text,
        'template': value,
        'value': response
    }
    history.append(history_item)

    # Save history to disk
    with open('history.json', 'w') as f:
        json.dump(history, f)

    return jsonify(history_item)


@app.route('/history', methods=['GET'])
def get_history():
    return jsonify(history)


if __name__ == '__main__':
    app.run(port=5500)

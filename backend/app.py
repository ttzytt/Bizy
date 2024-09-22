from flask import Flask, request, jsonify
import requests
import pandas as pd
import os
from flask_cors import CORS
import traceback
from werkzeug.utils import secure_filename
from flask import send_file
import io

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# Set the upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# @app.route('/chat', methods=['POST'])
# def chat():
    
#     user_message = request.json.get('message')

#     if not user_message:
#         return jsonify({"error": "Message is required"}), 400

#     url = "https://proxy.tune.app/chat/completions"
#     API_KEY = 'sk-tune-P2rQo1yVjT5bKrrbfLl5872UFvCmPydwdra'
#     headers = {
#         "Authorization": f"Bearer{API_KEY}",  # Your Tune API key
#         "Content-Type": "application/json",
#     }
#     data = {
#         "temperature": 0.8,
#         "messages": [
#             {
#                 "role": "system",
#                 "content": "Act as an assistant for small businesses"
#             },
#             {
#                 "role": "user",
#                 "content": user_message
#             }
#         ],
#         "model": "meta/llama-3.1-405b-instruct",
#         "stream": False,
#         "frequency_penalty": 0,
#         "max_tokens": 900
#     }

#     try:
#         # Send request to the LLM API
#         response = requests.post(url, headers=headers, json=data)

#         # Print the response text for debugging
#         print(response.text)

#         if response.ok:
#             ai_response = response.json()
#             prediction = ai_response.get("choices", [])[0].get("message", {}).get("content", "No insights available")
#             print(prediction)
#             return (prediction), 200
#         else:
#             return ("Failed to get AI response"), response.status_code

#     except Exception as e:
#         return ("error"+ str(e)), 500


@app.route('/upload', methods=['POST'])
def upload():
    print("Upload function called")
    try:
        if 'file' not in request.files:
            print("No file part in the request")
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']
        if file.filename == '':
            print("No selected file")
            return jsonify({'error': 'No selected file'}), 400

        if file:
            print(f"Processing file: {file.filename}")
            # Your file processing logic here
            filename = "data1" + os.path.splitext(secure_filename(file.filename))[1]

            # Save the file to the upload folder
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
            return jsonify({'message': 'File uploaded successfully'}), 200
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/get-csv-data', methods=['GET'])
def get_csv_data():
    csv_path = '/Users/kraj200/Downloads/pennhacks2024/Bizy_frontend/backend/uploads/data1.csv'
    try:
        with open(csv_path, 'r') as file:
            csv_content = file.read()  # Read the entire CSV content
            print(csv_content)
        return csv_content, 200, {'Content-Type': 'text/plain'}  # Send as plain text
    except Exception as e:
        print(f"Error reading CSV: {str(e)}")
        return jsonify({'error': 'Failed to read CSV'}), 500

if __name__ == '__main__':
    app.run(debug=True)
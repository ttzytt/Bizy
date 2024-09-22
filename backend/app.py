from flask import Flask, request, jsonify
import requests
import pandas as pd
import os
from flask_cors import CORS
import traceback
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId 
from flask import send_file
import io
mongo_uri = "mongodb+srv://tzyt:tzyt@cluster0.fcbm3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(mongo_uri, server_api=ServerApi('1'))
db = client['Bizy']
vendors_collection = db['vendors']
inventory_collection = db['inventory']

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:3000"}})

# Set the upload folder
UPLOAD_FOLDER = 'uploads'   
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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
    
@app.route('/inventory', methods=['GET'])
def get_inventory():
    inventory = list(inventory_collection.find({}))
    for item in inventory:
        item['_id'] = str(item['_id'])  # Convert ObjectId to string
    return jsonify(inventory)

@app.route('/inventory', methods=['POST'])
def add_inventory_item():
    item_data = request.json
    result = inventory_collection.insert_one(item_data)
    if '_id' in item_data:
        item_data['_id'] = str(item_data['_id'])   
    ret = {'id': str(result.inserted_id), **item_data} 
    return jsonify(ret), 201

@app.route('/inventory/<item_id>', methods=['DELETE'])
def delete_inventory_item(item_id):     
    print("deleting item " + item_id)
    try:
        result = inventory_collection.delete_one({'_id': ObjectId(item_id)})
        if result.deleted_count == 1:
            return jsonify({'message': 'Inventory item deleted successfully'}), 200
        else:
            return jsonify({'error': 'Item not found'}), 404
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/vendors', methods=['GET'])
def get_vendors():
    print("Get vendors function called")
    print(type(vendors_collection))
    vendors = list(vendors_collection.find({}))
    for vendor in vendors:
        vendor['_id'] = str(vendor['_id'])  # Convert ObjectId to string
    return jsonify(vendors)

@app.route('/vendors', methods=['POST'])
def add_vendor():
    vendor_data = request.json
    result = vendors_collection.insert_one(vendor_data)
    # Check if 'vendor_data' has an '_id' field and convert it if necessary
    if '_id' in vendor_data:
        vendor_data['_id'] = str(vendor_data['_id'])
    # return the newly added vendor data and the id of the new vendor
    ret = {'id': str(result.inserted_id), **vendor_data}
    return jsonify(ret), 201

@app.route('/vendors/<vendor_id>', methods=['DELETE'])
def delete_vendor(vendor_id):
    print("deleting vendor " + vendor_id)
    try:
        result = vendors_collection.delete_one({'_id': ObjectId(vendor_id)})
        if result.deleted_count == 1:
            return jsonify({'message': 'Vendor deleted successfully'}), 200
        else:
            return jsonify({'error': 'Vendor not found'}), 404
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': 'Internal server error'}), 500
    
@app.route('/get-csv-data', methods=['GET'])
def get_csv_data():
    csv_path = '/Users/kraj200/Downloads/pennhacks2024/Bizy_frontend/backend/uploads/data1.csv'
    if not os.path.exists(csv_path):
        return jsonify({'error': 'CSV file not found'}), 404
    try:
        with open(csv_path, 'r') as file:
            csv_content = file.read()
        return csv_content, 200, {'Content-Type': 'text/plain'}
    except Exception as e:
        print(f"Error reading CSV: {str(e)}")
        return jsonify({'error': 'Failed to read CSV'}), 500
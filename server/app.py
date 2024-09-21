from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/scrape', methods=['POST'])
def scrape():
    data = request.json
    title = data.get('title')
    body_text = data.get('bodyText')
    images = data.get('images', [])
    headers = data.get('headers', [])
    links = data.get('links', [])
    
    response = {
        'message': f'Title: {title}, Text Length: {len(body_text)}, Images Count: {len(images)}, Headers Count: {len(headers)}, Links Count: {len(links)}',
        'images': images[:100],  # Limit to first 100 images
        'headers': headers[:10],  # Limit to first 10 headers
        'links': links[:50]       # Limit to first 50 links
    }
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)

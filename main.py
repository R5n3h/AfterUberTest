# -*- coding: utf-8 -*-
__author__ = 'Ron Sneh <me@ronsneh.com>'

from flask import Flask, render_template, request, jsonify

import json

DEBUG = True

app = Flask(__name__)

INSERT_SERVER_TOKEN_HERE = '' # Uber API Server token

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/service/', methods=['POST', 'GET'])
def service():
    import requests

    request.get_json(force=True)

    url = 'https://api.uber.com/v1/estimates/price'

    parameters = {
        'server_token': INSERT_SERVER_TOKEN_HERE,
        'start_latitude': float(request.json['start_latitude']),
        'start_longitude': float(request.json['start_longitude']),
        'end_latitude': float(request.json['end_latitude']),
        'end_longitude': float(request.json['end_longitude'])
    }

    response = requests.get(url, params=parameters)

    data = response.json()
    if 'prices' not in data:
        return jsonify(message="Cannot find prices for this ride"), 404

    items = []
    for price in data['prices']:
        name = 'After%(name)s' % {'name': price['display_name'].title()}
        price = price['estimate']
        items.append({'name': name, 'price': price})

    return jsonify(items=items)

if __name__ == "__main__":
    app.run(debug=DEBUG, host='0.0.0.0')

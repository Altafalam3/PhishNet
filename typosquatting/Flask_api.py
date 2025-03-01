from flask import Flask, jsonify, request
from flask_restx import Api, Resource

import os
import configparser
import requests

import idna

pathConf = './conf/conf.cfg'

if os.path.isfile(pathConf):
    config = configparser.ConfigParser()
    config.read(pathConf)
else:
    print("[-] No conf file found")
    exit(-1)

if 'Flask_api' in config:
    FLASK_PORT = int(config['Flask_api']['port'])
    FLASK_URL = config['Flask_api']['ip']
    url_to_server = config['Flask_api']['url_to_server']
else:
    FLASK_PORT = '127.0.0.1'
    FLASK_URL = 7006
    url_to_server = "https://typosquatting-finder.circl.lu"



app = Flask(__name__)

api = Api(
        app, 
        title='ail-typo-squatting API', 
        description='API to submit domain and query a ail-typo-squatting instance.', 
        version='0.1', 
        default='GenericAPI', 
        default_label='Generic ail-typo-squatting API', 
        doc='/doc/'
    )


def checkDomain(url):
    """Check if the domain is valid"""
    try:
        _ = idna.decode(url)
    except Exception:
        return False
    else:
        if "." in url:
            return True
        return False

def prepareArg(data):
    if not data:
        return '?runAll'
    s = '?'

    for i in data:
        s += f"{i}&"
    s = s[:-1]

    return s


@api.route('/domains/<sid>')
@api.doc(description='Request instance to get domain result and current status of the queue', params={'sid': 'id of the scan'})
class Domains(Resource):
    def get(self, sid):
        domain = requests.get(f'{url_to_server}/domains/{sid}').json()
        status = requests.get(f'{url_to_server}/status/{sid}').json()
        
        if not type(domain) == dict:
            domain.append(status)

        return jsonify(domain)

@api.route('/scan/<url>')
@api.doc(description='Request instance to scan a domain', params={'url': 'url to scan'})
class ScanUrl(Resource):
    def get(self, url):
        if checkDomain(url):
            data = dict(request.args)
            s = prepareArg(data)

            r = requests.get(f'{url_to_server}/api/{url}{s}')

            if r.status_code == 200:
                sid = r.json()['sid']
                return sid
            
            return r.text
        return 'Domain not valid'

@api.route('/stop/<sid>')
@api.doc(description='Stop the current request', params={'sid': 'id of the scan'})
class Stop(Resource):
    def get(self, sid):
        stop = requests.get(f'{url_to_server}/stop/{sid}').json()
        return jsonify(stop)


if __name__ == "__main__":
    app.run(host=FLASK_URL, port=FLASK_PORT)

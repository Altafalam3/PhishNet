import os, re
import json
import math
import hashlib
import argparse
import configparser
from uuid import uuid4
from datetime import datetime
import logging

from flask import Flask, render_template, url_for, request, jsonify

import ail_typo_squatting

import redis

import requests

import urllib3
from urllib3.exceptions import InsecureRequestWarning
urllib3.disable_warnings(InsecureRequestWarning)

from queue import Queue
from threading import Thread

from pymisp import MISPEvent, MISPObject, MISPOrganisation
from typing import List

import tldextract

from bs4 import BeautifulSoup

from similarius import get_website, extract_text_ressource, sk_similarity, ressource_difference, ratio


#############
# Arg Parse #
#############

parser = argparse.ArgumentParser()
parser.add_argument("-c", "--nocache", help="Disabled caching functionality", action="store_true")
args = parser.parse_args()


##########
## CONF ##
##########

pathConf = './conf/conf.cfg'

if os.path.isfile(pathConf):
    config = configparser.ConfigParser()
    config.read(pathConf)
else:
    print("[-] No conf file found")
    exit(-1)

if 'Flask_server' in config:
    FLASK_PORT = int(config['Flask_server']['port'])
    FLASK_URL = config['Flask_server']['ip']
else:
    FLASK_URL = '127.0.0.1'
    FLASK_PORT = 7005

if 'Thread' in config:
    num_threads = int(config['Thread']['num_threads'])
else:
    num_threads = 10

if 'redis' in config:
    red = redis.Redis(host=config['redis']['host'], port=config['redis']['port'], db=config['redis']['db'])
else:
    red = redis.Redis(host='localhost', port=6379, db=0)

if 'redis_user' in config:
    red_user = redis.Redis(host=config['redis_user']['host'], port=config['redis_user']['port'], db=config['redis_user']['db'])
else:
    red_user = redis.Redis(host='localhost', port=6379, db=1)

if 'redis_warning_list' in config:
    redis_warning_list = redis.Redis(host=config['redis_warning_list']['host'], port=config['redis_warning_list']['port'], db=config['redis_warning_list']['db'])
else:
    redis_warning_list = redis.Redis(host='localhost', port=6379, db=2)

if not args.nocache:
    if 'cache' in config:
        cache_expire = config['cache']['expire']
    else:
        cache_expire = 86400
else:
    cache_expire = 0

if 'cache_session' in config:
    cache_expire_session = config['cache_session']['expire']
else:
    cache_expire_session = 3600


sessions = list()

with open("./etc/algo_list.json", "r") as read_json:
    algo_list = json.load(read_json)

#################
# Warning lists #
#################

if redis_warning_list.exists('majestic_million'):
    majestic_million = True
else:
    majestic_million = False

if redis_warning_list.exists('university_domains'):
    university = True
else:
    university = False

if redis_warning_list.exists('bank_website'):
    bank_website = True
else:
    bank_website = False

if redis_warning_list.exists('parking_domains'):
    parking_domain = True
else:
    parking_domain = False

if redis_warning_list.exists('parking_domains_ns'):
    parking_domain_ns = json.loads(redis_warning_list.get("parking_domains_ns").decode())
else:
    parking_domain_ns = False

if redis_warning_list.exists('tranco'):
    tranco = True
else:
    tranco = False

if redis_warning_list.exists('moz-top500'):
    moz_top500 = True
else:
    moz_top500 = False

#########
## APP ##
#########

app = Flask(__name__)
app.debug = True
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True


class Session():
    def __init__(self, url):
        """Constructor"""
        self.id = str(uuid4())
        self.url = url
        self.thread_count = num_threads
        self.jobs = Queue(maxsize=0)
        self.threads = []
        self.variations_list = list()
        self.result = list()
        self.stopped = False
        self.result_stopped = dict()
        self.add_data = False
        self.request_algo = list()
        self.catch_all = False

        self.result_algo = dict()
        for key in list(algo_list.keys()):
            self.result_algo[key] = []
        self.result_algo['original'] = []

        self.md5Url = hashlib.md5(url.encode()).hexdigest()

        self.website = ""
        self.website_ressource = dict()

        self.list_ns = list()
        self.list_mx = list()


    def scan(self):
        """Start all worker"""
        for i in range(len(self.variations_list)):
            #need the index and the url in each queue item.
            self.jobs.put((i, self.variations_list[i]))
        for _ in range(self.thread_count):
            worker = Thread(target=self.crawl)
            worker.daemon = True
            worker.start()
            self.threads.append(worker)


    def geoIp(self, ip):
        """Geolocation for an IP"""
        response = requests.get(f"https://ip.circl.lu/geolookup/{ip}")
        response_json = response.json()
        return response_json[0]['country_info']['Country'] 

    def get_original_website_info(self):
        """Get website ressource of request domain"""

        data = ail_typo_squatting.dnsResolving([self.url], self.url, "", catch_all=self.catch_all)

        response = get_website(self.url)
        if not response:
            self.website, self.website_ressource = extract_text_ressource("")
        else:
            self.website, self.website_ressource = extract_text_ressource(response.text)
            if "200" in str(response) or "401" in str(response):
                soup = BeautifulSoup(response.text, "html.parser")
                title = soup.find_all('title', limit=1)

                # Website has a title
                if title:
                    t = str(title[0])
                    t = t[7:]
                    t = t[:-8]
                    data[self.url]['website_title'] = t
        
        data[self.url]['website_sim'] = "100"
        data[self.url]['ressource_diff'] = "0"
        data[self.url]['ratio'] = 100

        data_keys = list(data[self.url].keys())

        if 'A' in data_keys:
            data[self.url]['geoip'] = self.geoIp(data[self.url]['A'][0])
        elif 'AAAA' in data_keys:
            data[self.url]['geoip'] = self.geoIp(data[self.url]['AAAA'][0]) 

        if 'MX' in data_keys:
            # Parse NS record to remove end point
            for i in range(0, len(data[self.url]['MX'])):
                data[self.url]['MX'][i] = data[self.url]['MX'][i][:-1]

        if 'NS' in data_keys:
            # Parse NS record to remove end point
            for i in range(0, len(data[self.url]['NS'])):
                data[self.url]['NS'][i] = data[self.url]['NS'][i][:-1]

        data[self.url]['variation'] = "original"

        self.result[0] = data
        self.result_algo["original"].append(data)


    def get_website_info(self, variation):
        """Get all info on variation's website and compare it to orginal one."""
        website_info = dict()
        website_info["title"] = ""
        website_info["sim"] = ""
        website_info["diff_score"] = ""
        website_info["ratio"] = ""

        response = get_website(variation)
        if response:
            # Variation has a website
            if "200" in str(response) or "401" in str(response):
                soup = BeautifulSoup(response.text, "html.parser")
                title = soup.find_all('title', limit=1)

                # Website has a title
                if title:
                    t = str(title[0])
                    t = t[7:]
                    t = t[:-8]
                    website_info["title"] = t

                # Get the text only and ressources
                text, ressource_dict = extract_text_ressource(response.text)

                if text and self.website:
                    sim = str(sk_similarity(self.website, text))
                    website_info['sim'] = sim
                    
                    # Ressources difference between original's website and varation one
                    ressource_diff = ressource_difference(self.website_ressource, ressource_dict)

                    website_info['ressource_diff'] = ressource_diff
                    
                    # Ratio to calculate the similarity probability
                    website_info['ratio'] = ratio(ressource_diff, sim)

        return website_info


    def check_warning_list(self, data, work):
        """Mark variations present in warning lists"""
        flag_parking = False
        data_keys = list(data[work[1][0]].keys())

        if majestic_million:
            if redis_warning_list.zrank('majestic_million', work[1][0]) != None:
                data[work[1][0]]['majestic_million'] = True
        if parking_domain:
            if 'A' in data_keys:
                for a in data[work[1][0]]['A']:
                    if redis_warning_list.zrank('parking_domains', a) != None:
                        data[work[1][0]]['parking_domains'] = True
                        data[work[1][0]]['park_ip'] = True
                        flag_parking = True
                        break
        if university:
            if redis_warning_list.zrank("university_domains", work[1][0]) != None:
                data[work[1][0]]['university_domains'] = True
        if bank_website:
            if redis_warning_list.zrank("bank_domains", work[1][0]) != None:
                data[work[1][0]]['bank_domains'] = True
        if parking_domain_ns and not flag_parking:
            if 'NS' in data_keys:
                for ns in data[work[1][0]]['NS']:
                    for park in parking_domain_ns:
                        if park in ns.lower():
                            data[work[1][0]]['parking_domains'] = True
                            break
        if tranco:
            if redis_warning_list.zrank('tranco', work[1][0]) != None:
                data[work[1][0]]['tranco'] = True
        if moz_top500:
            if redis_warning_list.zrank('moz-top500', work[1][0]) != None:
                data[work[1][0]]['moz-top500'] = True

        return data


    def crawl(self):
        """Threaded function for queue processing."""
        while not self.jobs.empty():
            work = self.jobs.get()   #fetch new work from the Queue
            try:
                flag = False
                ## If redis have some domains cached, don't resolve it again
                if self.result_stopped and not args.nocache:
                    if work[1][1] in list(self.result_stopped.keys()):
                        for domain in self.result_stopped[work[1][1]]:
                            if list(domain.keys())[0] == work[1][0]:
                                data = domain
                                data = self.check_warning_list(data, work)
                                flag = True

                ## Redis doesn't have this domain in is db
                if not flag:
                    if app.debug:
                        data = ail_typo_squatting.dnsResolving([work[1][0]], self.url, "-", verbose=True, catch_all=self.catch_all)
                    else:
                        data = ail_typo_squatting.dnsResolving([work[1][0]], self.url, "", catch_all=self.catch_all)

                    # Compare original and current variation website
                    website_info = self.get_website_info(work[1][0])

                    if "sim" in website_info:
                        data[work[1][0]]['website_sim'] = website_info["sim"]
                    if "title" in website_info:
                        data[work[1][0]]['website_title'] = website_info["title"]
                    if "ressource_diff" in website_info:
                        data[work[1][0]]['ressource_diff'] = website_info["ressource_diff"]
                    if "ratio" in website_info:
                        data[work[1][0]]['ratio'] = website_info["ratio"]

                    data_keys = list(data[work[1][0]].keys())

                    if 'A' in data_keys:
                        data[work[1][0]]['geoip'] = self.geoIp(data[work[1][0]]['A'][0])
                    elif 'AAAA' in data_keys:
                        data[work[1][0]]['geoip'] = self.geoIp(data[work[1][0]]['AAAA'][0])  


                    if 'MX' in data_keys:
                        # Parse NS record to remove end point
                        for i in range(0, len(data[work[1][0]]['MX'])):
                            data[work[1][0]]['MX'][i] = data[work[1][0]]['MX'][i][:-1]
                            # Mark variation if present in MX list
                            for mx in self.list_mx:
                                if data[work[1][0]]['MX'][i].split(" ")[1] in mx:
                                    data[work[1][0]]['mx_identified'] = True
                                    break

                    if 'NS' in data_keys:
                        # Parse NS record to remove end point
                        for i in range(0, len(data[work[1][0]]['NS'])):
                            data[work[1][0]]['NS'][i] = data[work[1][0]]['NS'][i][:-1]
                            # Mark variation if present in NS list
                            for ns in self.list_ns:
                                if data[work[1][0]]['NS'][i] in ns:
                                    data[work[1][0]]['ns_identified'] = True
                                    break

                    data[work[1][0]]['variation'] = work[1][1]
                    self.add_data = True

                    data = self.check_warning_list(data, work)

                self.result[work[0] + 1] = data         #Store data back at correct index
                self.result_algo[work[1][1]].append(data)
            except Exception as e:
                if app.debug:
                    print(e)
                bad_result = dict()
                bad_result[work[1][0]] = {"NotExist":True}
                self.result[work[0] + 1] = bad_result
                self.result_algo[work[1][1]].append(bad_result)
            finally:
                #signal to the queue that task has been processed
                self.jobs.task_done()
        return True

    def status(self):
        """Status of the current queue"""
        if self.jobs.empty():
            self.stop()

        total = len(self.variations_list)
        remaining = max(self.jobs.qsize(), len(self.threads))
        complete = total - remaining
        registered = sum([1 for x in self.result.copy() for e in x if not x[e]["NotExist"]])

        return {
            'id': self.id,
            'total': total,
            'complete': complete,
            'remaining': remaining,
            'registered': registered,
            'stopped' : self.stopped
            }

    def stop(self):
        """Stop the current queue and worker"""
        self.jobs.queue.clear()

        for worker in self.threads:
            worker.join(3.5)

        self.threads.clear()
        self.saveInfo()


    def domains(self):
        """Return all accessible domains"""
        domain = [x for x in self.result.copy() for e in x if not x[e]["NotExist"]]
        return domain
    
    def callVariations(self, data_dict):
        """Generate variations by options"""
        all_keys = data_dict.keys()
        if "runAll" in all_keys:
            self.catch_all = True
            self.request_algo = list(algo_list.keys())
            for key in self.request_algo:
                fun = getattr(ail_typo_squatting, key)
                self.variations_list = fun(self.url, self.variations_list, verbose=False, limit=math.inf, givevariations=True, keeporiginal=False)

        else:
            for key in all_keys:
                if key in list(algo_list.keys()):
                    self.request_algo.append(key)
                    fun = getattr(ail_typo_squatting, key)
                    self.variations_list = fun(self.url, self.variations_list, verbose=False, limit=math.inf, givevariations=True, keeporiginal=False)

        self.result = [{} for x in self.variations_list]
        self.result.append({})
        self.get_original_website_info()

    def dl_list(self):
        """list of variations to string"""
        s = ''
        for variation in self.variations_list:
            s += variation[0] + '\n'
        return s
        
    def saveInfo(self):
        """Save session info to redis"""
        saveInfo = dict()
        saveInfo['url'] = self.url
        saveInfo['result_list'] = self.result
        saveInfo['variations_list'] = self.variations_list
        saveInfo['stopped'] = self.stopped
        saveInfo['md5Url'] = self.md5Url
        saveInfo['request_algo'] = self.request_algo
        saveInfo['request_date'] = datetime.now().strftime("%Y-%m-%d %H-%M")

        red.set(self.id, json.dumps(saveInfo))
        red.expire(self.id, cache_expire_session)
        red.set(self.md5Url, 1)
        red.expire(self.md5Url, cache_expire)

        for key in self.result_algo:
            ## Check only request algo
            if self.result_algo[key]:
                flag = False
                ## Domain already in redis and add additionnal data to it
                ## Normaly it's because a stop has been done previously
                if self.add_data:
                    if red.exists(f"{self.md5Url}:{key}"):
                        ## Load json to update it with new domain
                        algo_redis = json.loads(red.get(f"{self.md5Url}:{key}").decode())
                        for domain in self.result_algo[key]:
                            if not domain in algo_redis:
                                algo_redis.append(domain)
                                flag = True
                                red.set(f"{self.md5Url}:{key}", json.dumps(algo_redis))
                                red.expire(f"{self.md5Url}:{key}", cache_expire)

                ## For the domain name, add algo
                if not flag:
                    red.set(f"{self.md5Url}:{key}", json.dumps(self.result_algo[key]))
                    red.expire(f"{self.md5Url}:{key}", cache_expire)
        try:
            sessions.remove(self)
            del self
        except:
            pass


##########
## MISP ##
##########

def create_misp_event(sid):
    """Create a MISP event for MISP feed"""
    sess_info = get_session_info(sid)

    org = MISPOrganisation()
    org.name = "typosquatting-finder.circl.lu"
    org.uuid = "8df15512-0314-4c2a-bd00-9334ab9b59e6"

    event = MISPEvent()
    event.uuid = sid

    event.info = f"Typosquatting for: {sess_info['url']}"  # Required
    event.distribution = 0  # Optional, defaults to MISP.default_event_distribution in MISP config
    event.threat_level_id = 4  # Optional, defaults to MISP.default_event_threat_level in MISP config
    event.analysis = 2  # Optional, defaults to 0 (initial analysis)
    event.Orgc = org

    return event


def feed_meta_generator(event, sid):
    """Generate MISP feed manifest"""
    manifests = {}
    hashes: List[str] = []

    manifests.update(event.manifest)
    hashes += [f'{h},{event.uuid}' for h in event.attributes_hashes('md5')]

    red.set(f"event_manifest:{sid}", json.dumps(manifests))
    red.set(f"event_hashes:{sid}", json.dumps(hashes))

    red.expire(f"event_manifest:{sid}", cache_expire_session)
    red.expire(f"event_hashes:{sid}", cache_expire_session)


def dl_misp_feed(sid, store=True):
    """Generate MISP feed to download"""
    event = create_misp_event(sid)
    result_list = dl_domains(sid)
    sess_info = get_session_info(sid)
    domain_identified = domains_redis(sid)

    misp_object = MISPObject('typosquatting-finder', standalone=False)
    qname = misp_object.add_attribute('research-domain', value=sess_info['url'])
    qname.add_tag({'name': "typosquatting:research", 'colour': "#00730d"})
    misp_object.add_attribute('variations-number', value=len(sess_info["result_list"]))
    misp_object.add_attribute('variations-found-number', value=len(domain_identified))
    event.add_object(misp_object)

    for algo in result_list:
        for i in range(0, len(result_list[algo])):
            for domain in result_list[algo][i]:
                misp_object = MISPObject('typosquatting-finder-result', standalone=False)
                qname = misp_object.add_attribute('queried-domain', value=domain)
                qname.add_tag({'name': f"typosquatting:{algo}", 'colour': "#e68b48"})

                if 'A' in result_list[algo][i][domain]:
                    for a in result_list[algo][i][domain]['A']:
                        misp_object.add_attribute('a-record', value=a)
                if 'AAAA' in result_list[algo][i][domain]:
                    for aaaa in result_list[algo][i][domain]['AAAA']:
                        misp_object.add_attribute('aaaa-record', value=aaaa)
                if 'MX' in result_list[algo][i][domain]:
                    for mx in result_list[algo][i][domain]['MX']:
                        misp_object.add_attribute('mx-record', value=mx)
                if 'NS' in result_list[algo][i][domain]:
                    for ns in result_list[algo][i][domain]['NS']:
                        misp_object.add_attribute('ns-record', value=ns)

                if "website_title" in result_list[algo][i][domain] and result_list[algo][i][domain]["website_title"]:
                    misp_object.add_attribute('website-title', value=result_list[algo][i][domain]["website_title"])

                if "website_sim" in result_list[algo][i][domain] and result_list[algo][i][domain]["website_sim"]:
                    misp_object.add_attribute('website-similarity', value=result_list[algo][i][domain]["website_sim"])

                if "ressource_diff" in result_list[algo][i][domain] and result_list[algo][i][domain]["ressource_diff"]:
                    misp_object.add_attribute('website-ressource-diff', value=result_list[algo][i][domain]["ressource_diff"])

                if "ratio" in result_list[algo][i][domain] and result_list[algo][i][domain]["ratio"]:
                    misp_object.add_attribute('ratio-similarity', value=result_list[algo][i][domain]["ratio"])

                event.add_object(misp_object)

    feed_event = event.to_feed()

    if store:
        red.set(f"event_json:{sid}", json.dumps(feed_event))
        red.expire(f"event_json:{sid}", cache_expire_session) # 1h

        return event
        
    return feed_event



#####################
# Redis interaction #
#####################

def get_session_info(sid):
    """Get session info from redis"""
    return json.loads(red.get(sid).decode())

def status_redis(sid):
    """Get session status from redis"""
    sess_info = get_session_info(sid)

    total = len(sess_info['variations_list'])
    remaining = 0
    complete = total - remaining
    registered = sum([1 for x in sess_info['result_list'].copy() for e in x if not x[e]["NotExist"]])
    return {
        'id': sid,
        'total': total,
        'complete': complete,
        'remaining': remaining,
        'registered': registered,
        'stopped' : sess_info['stopped']
        }

def domains_redis(sid):
    """Get identified domains list from redis"""
    sess_info = get_session_info(sid)
    domain = [x for x in sess_info['result_list'].copy() for e in x if not x[e]["NotExist"]]
    return domain

def dl_domains(sid):
    """Get identified domains list from redis to download"""
    sess_info = get_session_info(sid)
    request_algo = sess_info["request_algo"]
    request_algo.insert(0, 'original')
    result = dict()
    for key in request_algo:
        if red.exists(f"{sess_info['md5Url']}:{key}"):
            result[key] = list()
            loc_list = json.loads(red.get(f"{sess_info['md5Url']}:{key}").decode())

            for x in loc_list:
                for e in x:
                    if not x[e]["NotExist"]:
                        result[key].append(x)

            if not result[key]:
                del result[key]

    return result

def dl_list(sid):
    """Get variations list from redis to download"""
    sess_info = get_session_info(sid)

    s = ''
    for variation in sess_info["variations_list"]:
        s += variation[0] + '\n'
    return s


def get_algo_from_redis(data_dict, md5Url):
    """Get resolved domains list from redis"""
    request_algo = list()
    result_list = dict()

    if 'runAll' in data_dict.keys():
        request_algo = list(algo_list.keys())
    else:
        request_algo = list(data_dict.keys())
        request_algo.insert(0, 'original')
        try:
            request_algo.remove('url')
        except:
            pass

    for algo in request_algo:
        if red.exists(f"{md5Url}:{algo}"):
            result_list[algo] = json.loads(red.get(f"{md5Url}:{algo}").decode())
    return result_list


def set_info(domain, request):
    """Set user info to redis"""
    if 'x-forwarded-for' in request.headers:
        ip = request.headers['x-forwarded-for']
    else:
        ip = request.remote_addr
    user_agent = str(request.user_agent)
    now = datetime.now()
    dt_string = now.strftime("%Y/%m/%d %H:%M:%S")

    app.logger.warning(f"[{ip}]: {domain}")

    if red_user.exists(ip):
        current_data = json.loads(red_user.get(ip).decode())
        if not user_agent in current_data['user_agent']:
            current_data['user_agent'].append(user_agent)

        flag = False
        
        for i in range(0, len(current_data['domain'])):
            if domain in list(current_data['domain'][i].keys()):
                current_data['domain'][i][domain] = int(current_data['domain'][i][domain]) + 1
                flag = True
        if not flag:
            current_data['domain'].append({domain: 1})

        current_data['nb_request'] = int(current_data['nb_request']) + 1
        current_data['last_request'] = dt_string

        red_user.set(ip, json.dumps(current_data))
    else:
        export_data = dict()
        export_data['user_agent'] = [user_agent]
        export_data['nb_request'] = 1
        export_data['domain'] = [{domain: 1}]
        export_data['last_request'] = dt_string

        red_user.set(ip, json.dumps(export_data))


def valid_ns_mx(dns):
    """Regex to validate NS and MX entry"""
    loc_list = list()
    for element in dns.replace(" ", "").split(","):
        if re.search(r"^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-\_]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$", element):
            loc_list.append(element)
    return loc_list
    


###############
# FLASK ROUTE #
###############

@app.route("/")
def index():
    """Home page"""
    return render_template("home_page.html", algo_list=algo_list, len_table=len(list(algo_list.keys())), keys=list(algo_list.keys()), share=0)

@app.route("/info")
def info_page():
    """Info page"""
    return render_template("info.html", algo_list=algo_list, len_table=len(list(algo_list.keys())), keys=list(algo_list.keys()))

@app.route("/about")
def about_page():
    """About page"""
    return render_template("about.html")


@app.route("/typo", methods=['POST'])
def typo():
    """Run the scan"""
    try:
        data_dict = request.json["data_dict"]
        print("----------------------------------------")
        print(data_dict)
        print("----------------------------------------")

        url = data_dict["url"]
        print(url)

        domain_extract = tldextract.extract(url)

        res = ail_typo_squatting.check_valid_domain(domain_extract)
        if res:
            return jsonify({'message': res}), 400
            
        if domain_extract.suffix:
            url = '.'.join(part for part in [domain_extract.subdomain, 
                                       domain_extract.domain, 
                                       domain_extract.suffix] 
                      if part)
            
        set_info(url, request)

        md5Url = hashlib.md5(url.encode()).hexdigest()

        session = Session(url)
        session.list_ns = list()
        session.list_mx = list()

        if "catchAll" in data_dict:
            session.catch_all = True

        if 'NS' in data_dict:
            if data_dict['NS'].rstrip():
                session.list_ns = valid_ns_mx(data_dict['NS'])

        if 'MX' in data_dict:
            if data_dict['MX'].rstrip():
                session.list_mx = valid_ns_mx(data_dict['MX'])

        if red.exists(md5Url):
            session.result_stopped = get_algo_from_redis(data_dict, md5Url)

        session.callVariations(data_dict)
        session.scan()
        sessions.append(session)
        print(session.status())
        return jsonify(session.status()), 201
    except Exception as e:
        print(f"Error processing typosquatting request: {str(e)}")
        return jsonify(e), 400

@app.route("/stop/<sid>", methods=['POST', 'GET'])
def stop(sid):
    """Stop the <sid> queue"""
    for s in sessions:
        if s.id == sid:
            s.stopped = True
            s.stop()
            break
    return jsonify({"Stop": "Successful"}), 200


@app.route("/status/<sid>")
def status(sid):
    """Status of <sid> queue"""
    if red.exists(sid):
        return jsonify(status_redis(sid))
    else:
        for s in sessions:
            if s.id == sid:
                return jsonify(s.status())
    return jsonify({'message': 'Scan session not found'}), 404


@app.route("/domains/<sid>")
def domains(sid):
    """Return all accessible domains"""
    if red.exists(sid):
        return jsonify(domains_redis(sid))
    else:
        for s in sessions:
            if s.id == sid:
                return jsonify(s.domains())
    return jsonify({'message': 'Scan session not found'}), 404


@app.route("/download/<sid>/json")
def download_json(sid):
    """Give the result as json format"""
    if red.exists(sid):
        sess_info = get_session_info(sid)
        return jsonify(dl_domains(sid)), 200, {'Content-Disposition': f'attachment; filename=typo-squatting-{sess_info["url"]}.json'}
    else:
        for s in sessions:
            if s.id == sid:
                return jsonify(s.dl_domains()), 200, {'Content-Disposition': f'attachment; filename=typo-squatting-{s.url}.json'}
    return jsonify({'message': 'Scan session not found'}), 404


@app.route("/download/<sid>/list")
def download_list(sid):
    """Give the list of variations"""
    if red.exists(sid):
        sess_info = get_session_info(sid)
        return dl_list(sid), 200, {'Content-Type': 'text/plain', 'Content-Disposition': f'attachment; filename={sess_info["url"]}-variations.txt'}
    else:
        for s in sessions:
            if s.id == sid:
                return s.dl_list(), 200, {'Content-Type': 'text/plain', 'Content-Disposition': f'attachment; filename={s.url}-variations.txt'}
    return jsonify({'message': 'Scan session not found'}), 404

@app.route("/<sid>")
def share(sid):
    """Share a research"""
    return render_template("home_page.html", algo_list=algo_list, len_table=len(list(algo_list.keys())), keys=list(algo_list.keys()), share=sid)

@app.route("/share/<sid>")
def share_info(sid):
    """Get share info from redis"""
    if red.exists(sid):
        sess_info = get_session_info(sid)
        return sess_info['url'], 200
    return jsonify({'message': 'Scan session not found'}), 404


#############
## MISP DL ##
#############

@app.route("/download/<sid>/misp-feed")
def download_misp_feed(sid):
    """Give the list of variations"""
    if red.exists(sid):
        event = dl_misp_feed(sid, store=True)
        feed_meta_generator(event, sid)

        html = f'<a href="/download/{sid}/misp-feed/{event.uuid}.json">{event.uuid}.json</a>'
        html += f'<br /><a href="/download/{sid}/misp-feed/hashes.csv">hashes.csv</a>'
        html += f'<br /><a href="/download/{sid}/misp-feed/manifest.json">manifest.json</a>'

        return html
    return jsonify({"message": "Session not found"}), 404

@app.route("/download/<sid>/misp-feed/<file>")
def download_misp(sid, file):
    """Download a specific MISP feed file"""
    if file == 'hashes.csv':
        return jsonify(json.loads(red.get(f"event_hashes:{sid}").decode())), 200
    elif file == 'manifest.json':
        return jsonify(json.loads(red.get(f"event_manifest:{sid}").decode())), 200
    elif re.match(r"^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$", file.split('.')[0]):
        event = json.loads(red.get(f"event_json:{sid}").decode())
        if file.split('.')[0] == event['Event']['uuid']:
            return jsonify(json.loads(red.get(f"event_json:{sid}").decode())), 200
        else:
            return jsonify({'message': 'File not exist'})
    else:
        return jsonify({'message': 'File not exist'})

@app.route("/download/<sid>/misp-json")
def download_misp_json(sid):
    """Download MISP feed as json format"""
    event = dl_misp_feed(sid, store=False)
    return jsonify(event), 200, {'Content-Disposition': f"attachment; filename={event['Event']['uuid']}.json"}


#########
## API ##
#########

@app.route("/api/<url>", methods=['GET'])
def api(url):
    """Special api route"""
    data_dict = dict(request.args)
    loc_algo_list = list(algo_list.keys())
    loc_algo_list.append("runAll")
    for k in data_dict.keys():
        if k not in loc_algo_list:
            return jsonify({'Algorithm Error': 'The algo you want was not found'}), 400

    md5Url = hashlib.md5(url.encode()).hexdigest()
    session = Session(url)

    if red.exists(md5Url):
        session.result_stopped = get_algo_from_redis(data_dict, md5Url)

    session.callVariations(data_dict)
    session.scan()
    sessions.append(session)

    return jsonify({'sid': session.id}), 200


if __name__ == "__main__":
    app.run(host=FLASK_URL, port=FLASK_PORT)

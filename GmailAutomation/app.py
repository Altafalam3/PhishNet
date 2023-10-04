from flask import Flask, request, jsonify
from flask_cors import CORS
from urllib.parse import urlparse
import re
import ipaddress
import tldextract
import whois
import requests
from bs4 import BeautifulSoup
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Function to extract the domain from a URL
def getDomain(url):
    domain = urlparse(url).netloc
    if re.match(r"^www.", domain):
        domain = domain.replace("www.", "")
    return domain

# Checks for IP address in URL (Have_IP) -- 1(phishing)/0(legitimate)
def havingIP(url):
    try:
        ipaddress.ip_address(url)
        ip = 1
    except:
        ip = 0
    return ip

# Checks the presence of @ in URL (Have_At) -- 1(phishing)/0(legitimate)
def haveAtSign(url):
    if "@" in url:
        at = 1
    else:
        at = 0
    return at

# Finding the length of URL and categorizing (URL_Length) -- 1(phishing)/0(legitimate)
def getLength(url):
    if len(url) < 54:
        length = 0
    else:
        length = 1
    return length

# Gives the number of '/' in URL (URL_Depth) -- if depth is greater than 4, it might be phishing
def getDepth(url):
    s = urlparse(url).path.split('/')
    depth = 0
    for j in range(len(s)):
        if len(s[j]) != 0:
            depth = depth + 1
    return depth

# Checking for redirection '//' in the url (Redirection) -- 1(phishing)/0(legitimate)
def redirection(url):
    pos = url.rfind('//')
    if pos > 6:
        if pos > 7:
            return 1
        else:
            return 0
    else:
        return 0

# Existence of “HTTPS” Token in the Domain Part of the URL (https_Domain) -- 1(phishing)/0(legitimate)
def httpDomain(url):
    domain = urlparse(url).netloc
    if 'https' in domain:
        return 1
    else:
        return 0

# Checking for Shortening Services in URL (Tiny_URL)
shortening_services = r"bit\.ly|goo\.gl|shorte\.st|go2l\.ink|x\.co|ow\.ly|t\.co|tinyurl|tr\.im|is\.gd|cli\.gs|" \
                      r"yfrog\.com|migre\.me|ff\.im|tiny\.cc|url4\.eu|twit\.ac|su\.pr|twurl\.nl|snipurl\.com|" \
                      r"short\.to|BudURL\.com|ping\.fm|post\.ly|Just\.as|bkite\.com|snipr\.com|fic\.kr|loopt\.us|" \
                      r"doiop\.com|short\.ie|kl\.am|wp\.me|rubyurl\.com|om\.ly|to\.ly|bit\.do|t\.co|lnkd\.in|db\.tt|" \
                      r"qr\.ae|adf\.ly|goo\.gl|bitly\.com|cur\.lv|tinyurl\.com|ow\.ly|bit\.ly|ity\.im|q\.gs|is\.gd|" \
                      r"po\.st|bc\.vc|twitthis\.com|u\.to|j\.mp|buzurl\.com|cutt\.us|u\.bb|yourls\.org|x\.co|" \
                      r"prettylinkpro\.com|scrnch\.me|filoops\.info|vzturl\.com|qr\.net|1url\.com|tweez\.me|v\.gd|" \
                      r"tr\.im|link\.zip\.net"

def tinyURL(url):
    match = re.search(shortening_services, url)
    if match:
        return 1
    else:
        return 0

# Function to calculate the age of a domain
def get_domain_age(url):
    domain_info = tldextract.extract(url)
    domain_name = f"{domain_info.domain}.{domain_info.suffix}"

    try:
        domain_info = whois.whois(domain_name)

        if isinstance(domain_info.creation_date, list):
            creation_date = domain_info.creation_date[0]
        else:
            creation_date = domain_info.creation_date

        if isinstance(domain_info.expiration_date, list):
            expiration_date = domain_info.expiration_date[0]
        else:
            expiration_date = domain_info.expiration_date

        if isinstance(creation_date, datetime) and isinstance(expiration_date, datetime):
            age_of_domain = (expiration_date - creation_date).days
            today = datetime.now()
            end = abs((expiration_date - today).days)
            if (((age_of_domain / 30) < 6) or end < 6):
                return 0  # Suspicious
            else:
                return 1  # Not suspicious

    except Exception as e:
        return 0  # Suspicious on error

    return 0  # Default to suspicious if no valid dates found

# Function to check for iframe redirection
def check_iframe_redirection(url):
    try:
        response = requests.get(url)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            iframe_tags = soup.find_all('iframe')

            for iframe in iframe_tags:
                iframe_src = iframe.get('src')
                if iframe_src and iframe_src != url:
                    return 1  # iframe redirection detected
            
            return 0  # No redirection found

        else:
            return -1  # Indicates an error occurred during the request

    except Exception as e:
        return -1  # Indicates an error occurred during the request

# Function to check for mouse over effect
def mouseOver(url):
    try:
        response = requests.get(url)

        if response.status_code == 200:
            if re.findall("<script>.+onmouseover.+</script>", response.text):
                return 1  # Mouse over effect detected
            else:
                return 0  # No mouse over effect detected

        else:
            return -1  # Indicates an error occurred during the request

    except Exception as e:
        return -1  # Indicates an error occurred during the request

# Function to check for right-click disable
def disablerightClick(url):
    try:
        response = requests.get(url)

        if response.status_code == 200:
            if re.findall(r"event.button ?== ?2", response.text):
                return 0  # Right-click disabled
            else:
                return 1  # Right-click enabled

        else:
            return -1  # Indicates an error occurred during the request

    except Exception as e:
        return -1  # Indicates an error occurred during the request

# Function to check for URL forwarding
def forwarding(url):
    try:
        response = requests.get(url, allow_redirects=False)

        if response.status_code == 200:
            if len(response.history) > 0:
                return 1  # URL forwarding detected
            else:
                return 0  # No URL forwarding detected

        else:
            return -1  # Indicates an error occurred during the request

    except Exception as e:
        return -1  # Indicates an error occurred during the request

def extract_anchor_tags(url):
    hrefs = []

    try:
        # Send a GET request to the URL
        response = requests.get(url)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Parse the HTML content of the page
            soup = BeautifulSoup(response.text, 'html.parser')

            # Find all anchor (<a>) elements in the HTML
            anchor_tags = soup.find_all('a')

            # Extract and print the href and text content of clickable anchor tags
            for anchor in anchor_tags:
                href = anchor.get('href')

                # Check if the anchor tag has an href attribute (clickable link)
                if href:
                    # Use a regular expression to check if the href starts with http or https
                    if re.match(r'^https?://', href):
                        hrefs.append(href)
            print(hrefs)

        else:
            print(f"Failed to fetch URL. Status code: {response.status_code}")

    except Exception as e:
        print(f"Error: {e}")

    return hrefs



'''
-----------------------------------------
All the methods for predicting
whether the domain entered is
phishing or not
-----------------------------------------
'''
@app.route('/tickNotTick', methods=['POST'])
def analyze_url():
    try:
        data = request.json
        url = data['url']

        domain = getDomain(url)
        ip = havingIP(domain)
        at = haveAtSign(url)
        length = getLength(url)
        depth = getDepth(url)
        redirect = redirection(url)
        https_domain = httpDomain(url)
        tiny_url = tinyURL(url)
        phishing_count = sum([ip, at, length, depth > 4, redirect, https_domain == 0, tiny_url])

        dom = get_domain_age(url)
        redr = check_iframe_redirection(url)
        mo = mouseOver(url)
        disright = disablerightClick(url)
        fwd = forwarding(url)
        phishing_count_html = sum([redr, mo, disright, fwd])

        total_triggers = sum([phishing_count, phishing_count_html, dom])
        
        result_conclusion = ''
        if total_triggers > 7:
            result_conclusion = "Website may be suspicious"
        else:
            result_conclusion = "Website may be safe"

        domain_info = whois.whois(domain)
        response_data = {
            "message": "Analysis complete",
            "result_conclusion": result_conclusion,
            "domain": domain,  # Include domain
            "ip": ip,  # Include IP presence
            "at_sign": at,  # Include @ presence
            "url_length": length,  # Include URL length
            "url_depth": depth,  # Include URL depth
            "redirection": redirect,  # Include redirection presence
            "https_domain": https_domain,  # Include HTTPS in domain presence
            "tiny_url": tiny_url,  # Include tiny URL presence
            "iframe_redirection": redr,  # Include iframe redirection
            "mouse_over_effect": mo,  # Include mouse over effect
            "right_click_disabled": disright,  # Include right-click disabled
            "url_forwarding": fwd,  # Include URL forwarding

            "whois_data": domain_info, # who is data alll
            "triggers": {
                "feature_extraction_triggers": phishing_count,
                "whois_triggers": dom,
                "html_js_triggers": phishing_count_html,
                "total_triggers": total_triggers
            },
        }
        print(response_data)
        return jsonify(response_data)
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True, port = 5000)

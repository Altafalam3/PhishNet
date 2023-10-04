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
CORS(app)  # Enable CORS for all routes




#address based features 
# Function to extract the domain from a URL
def getDomain(url):
    domain = urlparse(url).netloc
    if re.match(r"^www.", domain):
        domain = domain.replace("www.", "")
    print("domain name: ",domain)
    return domain

# Checks for IP address in URL (Have_IP) -- 1(phishing)/0(legitimate)
def havingIP(url):
    try:
        ipaddress.ip_address(url)
        ip = 1
        print("ip - ",1)
    except:
        ip = 0
        print("ip -",0)
    print("")
    return ip

# Checks the presence of @ in URL (Have_At) -- 1(phishing)/0(legitimate)
def haveAtSign(url):
    if "@" in url:
        at = 1
        print("have@ -",1)
    else:
        at = 0
        print("have@ -",0)
    return at

# Finding the length of URL and categorizing (URL_Length) -- 1(phishing)/0(legitimate)
def getLength(url):
    if len(url) < 54:
        length = 0
        print("length of url - ",length)
    else:
        length = 1
        print("length of url - ",length)
    return length

# Gives the number of '/' in URL (URL_Depth) -- if depth is greater than 4, it might be phishing
def getDepth(url):
    s = urlparse(url).path.split('/')
    depth = 0
    for j in range(len(s)):
        if len(s[j]) != 0:
            depth = depth + 1
    print("depth_of_url:",depth)
    return depth

# Checking for redirection '//' in the url (Redirection) -- 1(phishing)/0(legitimate)
def redirection(url):
    pos = url.rfind('//')
    if pos > 6:
        if pos > 7:
            print("redirection:-",1)
            return 1
        else:
            print("redirection:-",0)
            return 0
    else:
        print("redirection:-",0)
        return 0

# Existence of “HTTPS” Token in the Domain Part of the URL (https_Domain) -- 1(phishing)/0(legitimate)
def httpDomain(url):
    domain = urlparse(url).netloc
    if 'https' in domain:
        print("https:-",1)
        return 1
    else:
        print("https:-",0)
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
        print("tiny_url",1)
        return 1
    else:
        print("tiny_url",0)
        return 0

# Combine all the feature extraction functions
'''def feature_extract(url):
    domain = getDomain(url)
    ip = havingIP(domain)
    at = haveAtSign(url)
    length = getLength(url)
    depth = getDepth(url)
    redirect = redirection(url)
    https_domain = httpDomain(url)
    tiny_url = tinyURL(url)
    phishing_count = sum([ip, at, length, depth > 4, redirect, https_domain == 0, tiny_url])
    print("feature_extraction_phishing_activities: ",phishing_count)
    if phishing_count>2 and phishing_count>=0: 
        print("Provided URL may be suspicious(feature_extraction)")
    else: 
        print("provided URL is safe(feature_extraction)")'''

# Example usage:
'''print("Domain:", getDomain(url))
print("Having IP (Have_IP):", havingIP(url))
print("Have At Sign (Have_At):", haveAtSign(url))
print("URL Length (URL_Length):", getLength(url))
print("URL Depth (URL_Depth):", getDepth(url))
print("Redirection (Redirection):", redirection(url))
print("HTTPS Domain (https_Domain):", httpDomain(url))
print("Tiny URL (Tiny_URL):", tinyURL(url))'''

#------------------------------------------------------------------------------------------------------------
#domain based features 
import re
from bs4 import BeautifulSoup
import whois
import urllib
import urllib.request
from datetime import datetime

# Web traffic (Web_Traffic) - use alexa database to see if website is phishing or not ? top 1,00,000 websites are not phishing and phishing webistes are short lived 
'''def web_traffic(url):
    try:
        # Filling the whitespaces in the URL if any
        url = urllib.parse.quote(url)
        rank = BeautifulSoup(urllib.request.urlopen("https://data.alexa.com/data?cli=10&dat=s&url=" + url).read(), "xml").find(
            "REACH")['RANK']
        rank = int(rank)
        print(rank)
        
        if rank < 100000:
            return 1
        else:
            return 0
    except Exception as e:
        print("Error:", e)
        return -1  # Indicates an error occurred'''

#Survival time of domain: The difference between termination time and creation time (Domain_Age) is less than 6 months 
from datetime import datetime
import tldextract
import whois

def get_domain_age(url):
    # Extract the domain name from the URL
    domain_info = tldextract.extract(url)
    domain_name = f"{domain_info.domain}.{domain_info.suffix}"

    try:
        # Perform a WHOIS lookup to get domain information
        domain_info = whois.whois(domain_name)
        print(domain_info)
        # Check if creation_date is a list (some domains may have multiple creation dates)
        if isinstance(domain_info.creation_date, list):
            creation_date = domain_info.creation_date[0]
        else:
            creation_date = domain_info.creation_date

        # Check if expiration_date is a list (some domains may have multiple expiration dates)
        if isinstance(domain_info.expiration_date, list):
            expiration_date = domain_info.expiration_date[0]
        else:
            expiration_date = domain_info.expiration_date

        if isinstance(creation_date, datetime) and isinstance(expiration_date, datetime):
            age_of_domain = (expiration_date - creation_date).days
            print("age of domain:(in days) ",age_of_domain)
            today=datetime.now() 
            end = abs((expiration_date - today).days)
            if (((age_of_domain / 30) < 6) or end < 6):
                print("domain may be suspicious(domain_age)")  # Suspicious
                print("domain_age:-",0)
                return 0
            else:
                print("domain is safe(domain_age)")  # Not suspicious
                print("domain_age:-",1)
                return 1

    except Exception as e:
        print(f"Error: {e}")
        return 0  # Suspicious on error
    return 0  # Default to suspicious if no valid dates found

#----------------------------------------------------------------------------------------------------------------------------------------
#HTML and JS based features 

#iframe redirection 
import requests 
from bs4 import BeautifulSoup

def check_iframe_redirection(url):
    try:
        # Send a GET request to the URL
        response = requests.get(url)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Parse the HTML content of the page
            soup = BeautifulSoup(response.text, 'html.parser')

            # Find all iframe elements in the HTML
            iframe_tags = soup.find_all('iframe')

            for iframe in iframe_tags:
                # Extract the 'src' attribute of the iframe
                iframe_src = iframe.get('src')
                
                # Check if the 'src' attribute contains a different URL
                if iframe_src and iframe_src != url:
                    print("iframe:-",1)
                    return 1
            
            # No redirection found
            print("iframe:-",1)
            return 0

        else:
            print(f"Failed to fetch URL. Status code: {response.status_code}")
            return -1

    except Exception as e:
        print(f"Error: {e}")
        return False -1
    
#Checks the effect of mouse over on status bar (Mouse_Over)
#Phishers may use JavaScript to show a fake URL in the status bar to users. To extract this feature, 
#we must dig-out the webpage source code, particularly the “onMouseOver” event, and check if it makes any changes on the status bar
#If the response is empty or onmouseover is found then, the value assigned to this feature is 1 (phishing) or else 0 (legitimate).
def mouseOver(url):
    try:
        # Send a GET request to the URL
        response = requests.get(url)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Check if the response text contains a script with onmouseover event
            if re.findall("<script>.+onmouseover.+</script>", response.text):
                print("onmouseover:-",1)
                return 1  # Mouse over effect detected
            else:
                print("onmouseover:-",0)
                return 0  # No mouse over effect detected

        else:
            print(f"Failed to fetch URL. Status code: {response.status_code}")
            return -1  # Indicates an error occurred during the request

    except Exception as e:
        print(f"Error: {e}")
        return -1  # Indicates an error occurred during the request

#no copy of source code 
def disablerightClick(url):
    try:
        # Send a GET request to the URL
        response = requests.get(url)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Check if the response text contains a script with onmouseover event
            if re.findall(r"event.button ?== ?2", response.text):
                print("right_click:-",0)
                return 0  
            else:
                print("right_click:-",1)
                return 1 #right click disabled 

        else:
            print(f"Failed to fetch URL. Status code: {response.status_code}")
            return -1  # Indicates an error occurred during the request

    except Exception as e:
        print(f"Error: {e}")
        return -1  # Indicates an error occurred during the request

#Website forwarding 
#The fine line that distinguishes phishing websites from legitimate ones 
# is how many times a website has been redirected. In our dataset, we find that legitimate websites have been redirected one time max. 
# On the other hand, phishing websites containing this feature have been redirected at least 4 times.

def forwarding(url):
    try:
        # Send a GET request to the URL
        response = requests.get(url, allow_redirects=False)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Check if there is URL forwarding (more than one redirection)
            if len(response.history) > 0:
                print("forwarding:-",1)
                return 1  # URL forwarding detected
            else:
                print("forwarding:-",0)
                return 0  # No URL forwarding detected

        else:
            print(f"Failed to fetch URL. Status code: {response.status_code}")
            return -1  # Indicates an error occurred during the request

    except Exception as e:
        print(f"Error: {e}")
        return -1  # Indicates an error occurred during the request
    
'''def html_js(url):
    redr=check_iframe_redirection(url)
    mo=mouseOver(url)
    disright=disablerightClick(url)
    fwd=forwarding(url)
    phishing_count_html = sum([redr,mo,disright,fwd])
    print("html_js_phishing_activities: ",phishing_count_html)
    if phishing_count_html>2 and phishing_count_html>=0: 
        print("Provided URL may be suspicious (html_js)")
    else: 
        print("provided URL is safe (html_js)")'''

#---------------------------------------------------------------------------------------------------------------
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
#---------------------------------------------------------------------------------------------------------------
def overall_function(url): 
    domain = getDomain(url)
    ip = havingIP(domain)
    at = haveAtSign(url)
    length = getLength(url)
    depth = getDepth(url)
    redirect = redirection(url)
    https_domain = httpDomain(url)
    tiny_url = tinyURL(url)
    phishing_count = sum([ip, at, length, depth > 4, redirect, https_domain == 0, tiny_url])
    dom=get_domain_age(url)
    redr=check_iframe_redirection(url)
    mo=mouseOver(url)
    disright=disablerightClick(url)
    fwd=forwarding(url)
    phishing_count_html = sum([redr,mo,disright,fwd])
    print("feature_extrction_triggers: ",phishing_count)
    print("whois_triggers: ",dom)
    print("html_js_triggers: ",phishing_count_html)
    print("total triggers: ",sum([phishing_count,phishing_count_html,dom]))
    if(sum([phishing_count,phishing_count_html,dom])>7): 
        print("Final - Website may be suspicious")
    else: 
        print("Final - website may be safe")

# Example usage
#https://
url = "https://dynamicbusiness.com/locked/norton-reveals-100-most-dangerous-websites4168.html"
anchor=extract_anchor_tags(url)
overall_function(url)
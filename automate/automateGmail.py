import imaplib
import email
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
import requests

# IMAP Configuration
IMAP_SERVER = 'imap.gmail.com'
IMAP_USERNAME = 'davidherealways@gmail.com'
IMAP_PASSWORD = 'qeij eqsh ipov cedn'

# SMTP Configuration
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
SMTP_USERNAME = 'davidherealways@gmail.com'
SMTP_PASSWORD = 'qeij eqsh ipov cedn'

# API Configuration
API_URL = 'http://localhost:5000/tickNotTick'

# Create a function to send an email
def send_email(subject, body, recipient_email):
    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as smtp:
        smtp.starttls()
        smtp.login(SMTP_USERNAME, SMTP_PASSWORD)
        msg = MIMEMultipart()
        msg['From'] = SMTP_USERNAME
        msg['To'] = recipient_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))
        smtp.sendmail(SMTP_USERNAME, recipient_email, msg.as_string())

while True:
    try:
        # Connect to the IMAP server
        with imaplib.IMAP4_SSL(IMAP_SERVER) as imap:
            imap.login(IMAP_USERNAME, IMAP_PASSWORD)
            imap.select('inbox')

            # Search for unseen emails
            _, email_ids = imap.search(None, 'UNSEEN')

            if email_ids[0]:
                email_id_list = email_ids[0].split()
                for email_id in email_id_list:
                    _, message_data = imap.fetch(email_id, '(RFC822)')
                    # print(f"1{message_data}")
                    raw_email = message_data[0][1]
                    email_message = email.message_from_bytes(raw_email)
                    print(f"2{email_message}")
                    sender_email = email_message['From']
                    print(f"3{sender_email}")
                    email_subject = email_message['Subject']
                    print(f"4{email_subject}")
                    
                  #   email_body = email_message.get_payload(decode=True).decode('utf-8')
                  #   print(f"5{email_body}")
                    email_body = ' '
                    if email_message.is_multipart():
                        for part in email_message.walk():
                            if part.get_content_type() == 'text/plain':
                                email_body = part.get_payload(decode=True).decode('utf-8')
                                break  # Stop when the first text/plain part is found
                    else:
                        email_body = email_message.get_payload(decode=True).decode('utf-8')
                    
                    print(f"5{email_body}")
                    # Send email content to API for processing
                    # api_response = requests.post(API_URL, json={'email_body': email_body})
                    api_response = f"Hello World Guys {raw_email}, {sender_email}, {email_subject}, {email_body}"
                    print(f"6{api_response}")
                    # Process API response (assuming API returns a reply)
                    #   reply_text = api_response.text

                    # Send the reply to the original sender
                    send_email(f'Re: {email_subject}', api_response, sender_email)

                    # Mark the email as read
                    imap.store(email_id, '+FLAGS', '\Seen')

    except Exception as e:
        print(f'An error occurred: {str(e)}')

    # Set the interval to check for new emails (e.g., every 60 seconds)
    import time
    time.sleep(1)

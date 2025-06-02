from flask import Flask, request, redirect, url_for, session, render_template_string
import mysql.connector
from flask_mail import Mail, Message
import random
import string
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Needed for session



# Flask-Mail config for Gmail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'groupkillers312747@gmail.com'         # <-- your Gmail address
app.config['MAIL_PASSWORD'] = 'nony jfrb ftue cwov'            # <-- your Gmail App Password
mail = Mail(app)

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="yacine",
        database="project2eme"
    )

@app.route('/login', methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Check if shop owner
    cursor.execute("SELECT nom, prenom, email FROM shopowner WHERE email=%s AND mdp=%s", (email, password))
    shopowner = cursor.fetchone()
    if shopowner:
        cursor.close()
        conn.close()
        return {
            'status': 'success',
            'redirect': url_for('static', filename='welcome.html') + '?type=owner'
        }
    
    # Check if manager
    cursor.execute("SELECT nom, email FROM manager WHERE email=%s AND mdp=%s", (email, password))
    manager = cursor.fetchone()
    if manager:
        cursor.close()
        conn.close()
        return {
            'status': 'success',
            'redirect': url_for('static', filename='welcome.html') + '?type=manager'
        }

    # Check if client
    cursor.execute("SELECT nom, prenom, email FROM client WHERE email=%s AND mdp=%s", (email, password))
    client = cursor.fetchone()
    cursor.close()
    conn.close()
    if client:
        return {
            'status': 'success',
            'redirect': url_for('static', filename='welcome.html') + '?type=client'
        }
    else:
        return {"status": "error", "message": "Invalid credentials"}, 401

@app.route('/signup', methods=['POST'])
def signup():
    nom = request.form.get('nom')
    prenom = request.form.get('prenom')
    email = request.form.get('email')
    password = request.form.get('password')
    account_type = request.form.get('accountType')

    conn = get_connection()
    cursor = conn.cursor()

    # Check if email already exists in any user table
    if account_type == 'owner':
        cursor.execute("SELECT 1 FROM shopowner WHERE email=%s", (email,))
    elif account_type == 'manager':
        cursor.execute("SELECT 1 FROM manager WHERE email=%s", (email,))
    else:
        cursor.execute("SELECT 1 FROM client WHERE email=%s", (email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return "Email already exists", 409

    if account_type == 'owner':
        cursor.execute(
            "INSERT INTO shopowner (nom, prenom, email, mdp) VALUES (%s, %s, %s, %s)",
            (nom, prenom, email, password)
        )
    elif account_type == 'manager':
        cursor.execute(
            "INSERT INTO manager (nom, email, mdp) VALUES (%s, %s, %s)",
            (nom, email, password)
        )
    else:
        cursor.execute(
            "INSERT INTO client (nom, prenom, email, mdp) VALUES (%s, %s, %s, %s)",
            (nom, prenom, email, password)
        )

    conn.commit()
    cursor.close()
    conn.close()

    # Generate a secure random code
    code = ''.join(random.choices(string.digits, k=6))
    session['verification_code'] = code
    session['verification_email'] = email
    session['account_type'] = account_type

    # Send email
    msg = Message('Your Confirmation Code',
                  sender=app.config['MAIL_USERNAME'],
                  recipients=[email])
    msg.body = f'Your confirmation code is: {code}'
    mail.send(msg)

    # Redirect to confirm.html with account type
    return redirect(url_for('static', filename='confirm.html', type=account_type))

@app.route('/verify_code', methods=['POST'])
def verify_code():
    code = request.form.get('code')
    if code == session.get('verification_code'):
        # Email confirmed, you can update DB if needed
        return 'success'
    else:
        return 'fail'

@app.route('/save_restaurant', methods=['POST'])
def save_restaurant():
    email = request.form.get('email')
    nom = request.form.get('nom')  # restaurant name
    emplacement = request.form.get('emplacement')
    note = request.form.get('note')
    note = int(note) if note and note.isdigit() else None
    id_avis = request.form.get('id_avis')
    id_avis = int(id_avis) if id_avis and id_avis.isdigit() else None
    opening_days = request.form.get('opening_days')
    opening_hours = request.form.get('opening_hours')
    closing_hours = request.form.get('closing_hours')

    conn = get_connection()
    cursor = conn.cursor()

    # Get shopowner and their id_restaurant
    cursor.execute("SELECT id, id_restaurant FROM shopowner WHERE email=%s", (email,))
    shopowner = cursor.fetchone()
    if not shopowner:
        cursor.close()
        conn.close()
        return "Shopowner not found", 404

    shopowner_id, id_restaurant = shopowner

    if id_restaurant is None:
        # Create new restaurant
        cursor.execute(
            "INSERT INTO restaurant (nom, emplacement, note, id_avis, opening_days, opening_hours, closing_hours) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (nom, emplacement, note, id_avis, opening_days, opening_hours, closing_hours)
        )
        new_id = cursor.lastrowid
        # Update shopowner with new restaurant id
        cursor.execute("UPDATE shopowner SET id_restaurant=%s WHERE id=%s", (new_id, shopowner_id))
    else:
        # Update existing restaurant
        cursor.execute(
            "UPDATE restaurant SET nom=%s, emplacement=%s, note=%s, id_avis=%s, opening_days=%s, opening_hours=%s, closing_hours=%s WHERE id_restaurant=%s",
            (nom, emplacement, note, id_avis, opening_days, opening_hours, closing_hours, id_restaurant)
        )

    conn.commit()
    cursor.close()
    conn.close()
    return "success"

@app.route('/api/restaurants')
def api_restaurants():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id_restaurant AS id, nom AS name, emplacement AS address, note AS rating, category, description FROM restaurant")
    restaurants = cursor.fetchall()
    cursor.close()
    conn.close()
    for r in restaurants:
        r['image'] = 'default-image.jpg'  # Placeholder
    return {"restaurants": restaurants}

if __name__ == '__main__':
    app.run(debug=True)
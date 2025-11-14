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
    try:
        data = request.get_json()
        if not data:
            return {"status": "error", "message": "No JSON data received"}, 400
        
        # Get basic data
        email = data.get('email')
        nom = data.get('firstName')
        description = data.get('description', '')
        category = data.get('category')
        
        # Get location data
        location_data = data.get('location', {})
        emplacement = location_data.get('address', '')
        latitude = location_data.get('latitude')
        longitude = location_data.get('longitude')

        # Handle opening hours
        try:
            opening_days = data.get('opening_days')
            opening_hours = data.get('opening_hours')
            closing_hours = data.get('closing_hours')
        except Exception as e:
            print(f"Error parsing hours: {str(e)}")
            return {"status": "error", "message": "Invalid hours format"}, 400

        # Validate required fields
        if not all([email, nom]):
            return {"status": "error", "message": "Missing required fields"}, 400

        conn = get_connection()
        cursor = conn.cursor()

        try:
            # Get shopowner and their id_restaurant
            cursor.execute("SELECT id, id_restaurant FROM shopowner WHERE email=%s", (email,))
            shopowner = cursor.fetchone()
            
            if not shopowner:
                return {"status": "error", "message": "Shopowner not found"}, 404

            shopowner_id, id_restaurant = shopowner

            if id_restaurant is None:
                # Create new restaurant
                cursor.execute("""
                    INSERT INTO restaurant (
                        nom, emplacement, latitude, longitude, 
                        opening_days, opening_hours, closing_hours,
                        description, category, note
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    nom, emplacement, latitude, longitude, 
                    opening_days, opening_hours, closing_hours,
                    description, category, 0  # Default rating
                ))
                new_id = cursor.lastrowid
                cursor.execute("UPDATE shopowner SET id_restaurant=%s WHERE id=%s", 
                             (new_id, shopowner_id))
            else:
                # Update existing restaurant
                cursor.execute("""
                    UPDATE restaurant 
                    SET nom=%s, emplacement=%s, latitude=%s, longitude=%s, 
                        opening_days=%s, opening_hours=%s, closing_hours=%s,
                        description=%s, category=%s
                    WHERE id_restaurant=%s
                """, (
                    nom, emplacement, latitude, longitude,
                    opening_days, opening_hours, closing_hours,
                    description, category, id_restaurant
                ))

            conn.commit()
            return {"status": "success"}

        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        print(f"Error in save_restaurant: {str(e)}")
        return {"status": "error", "message": str(e)}, 500

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

@app.route('/submit_review', methods=['POST'])
def submit_review():
    try:
        data = request.get_json()
        if not data:
            return {"status": "error", "message": "No JSON data received"}, 400
        
        conn = get_connection()
        cursor = conn.cursor()

        # Convert ratings to integers, use NULL if not provided
        restaurant_id = int(data.get('restaurant_id', 0))
        overall_rating = int(data.get('overall_rating', 0)) if data.get('overall_rating') else None
        service_rating = int(data.get('service_rating', 0)) if data.get('service_rating') else None
        parking_rating = int(data.get('parking_rating', 0)) if data.get('parking_rating') else None
        cleanliness_rating = int(data.get('cleanliness_rating', 0)) if data.get('cleanliness_rating') else None
        value_rating = int(data.get('value_rating', 0)) if data.get('value_rating') else None
        quality_rating = int(data.get('quality_rating', 0)) if data.get('quality_rating') else None
        comment = data.get('comment', '')

        # Insert into reviews table
        cursor.execute("""
            INSERT INTO reviews (
                restaurant_id, overall_rating, service_rating,
                parking_rating, cleanliness_rating, value_rating,
                quality_rating, comment
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            restaurant_id,
            overall_rating,
            service_rating,
            parking_rating,
            cleanliness_rating,
            value_rating,
            quality_rating,
            comment
        ))

        # Update restaurant's average rating
        cursor.execute("""
            UPDATE restaurant 
            SET note = %s
            WHERE id_restaurant = %s
        """, (overall_rating, restaurant_id))

        conn.commit()
        cursor.close()
        conn.close()
        return {"status": "success", "rating": overall_rating}

    except Exception as e:
        print(f"Error in submit_review: {str(e)}")
        return {"status": "error", "message": str(e)}, 500

if __name__ == '__main__':
    app.run(debug=True)
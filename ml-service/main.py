from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import pandas as pd
from textblob import TextBlob
import os

app = FastAPI(title="Beauty Hub ML Service", version="1.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Beauty Hub ML API"}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ml-backend"}


from pydantic import BaseModel
import csv

class Review(BaseModel):
    name: str
    text: str
    rating: int

@app.post("/api/reviews")
def add_review(review: Review):
    # Calculate sentiment in real-time
    blob = TextBlob(review.text)
    polarity = blob.sentiment.polarity
    
    # Classify sentiment
    if polarity > 0.1:
        sentiment = 'positive'
    elif polarity < -0.1:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'
        
    # Append to the reviews.csv database
    import os
    file_exists = os.path.exists("data/reviews.csv")
    
    with open("data/reviews.csv", mode='a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(['review_id', 'customer_id', 'booking_id', 'rating', 'review_text', 'date'])
        
        import uuid
        from datetime import datetime
        
        review_id = str(uuid.uuid4())[:8]
        date_str = datetime.now().strftime('%Y-%m-%d')
        writer.writerow([review_id, review.name, 'web_booking', review.rating, review.text, date_str])
        
    return {"message": "Review added successfully", "sentiment": sentiment, "score": polarity}

@app.get("/api/sentiment")
def get_sentiment_analysis():
    if db is None:
        return {"error": "Database not connected"}
    
    try:
        doc = db["testimonials"].find_one({"_id": "array_store"})
        reviews_data = doc["data"] if doc and "data" in doc else []
    except Exception as e:
        reviews_data = []

    if not reviews_data:
        return {
            "total_reviews": 0,
            "positive_pct": 0,
            "neutral_pct": 0,
            "negative_pct": 0,
            "action_required": []
        }

    df = pd.DataFrame(reviews_data)
    
    if 'review' in df.columns:
        df['review_text'] = df['review']
    elif 'text' in df.columns:
        df['review_text'] = df['text']
    
    if 'review_text' not in df.columns:
        df['review_text'] = ""

    def analyze_sentiment(text):
        polarity = TextBlob(str(text)).sentiment.polarity
        if polarity > 0.1: return 'Positive'
        elif polarity < -0.1: return 'Negative'
        else: return 'Neutral'
        
    df['sentiment'] = df['review_text'].apply(analyze_sentiment)
    
    total = len(df)
    counts = df['sentiment'].value_counts()
    pos_count = int(counts.get('Positive', 0))
    neu_count = int(counts.get('Neutral', 0))
    neg_count = int(counts.get('Negative', 0))
    
    if 'date' not in df.columns:
        df['date'] = datetime.now().strftime('%Y-%m-%d')
        
    negative_reviews = df[df['sentiment'] == 'Negative'][['review_text', 'date']].tail(5).to_dict(orient='records')
    
    return {
        "total_reviews": total,
        "positive_pct": round((pos_count / total) * 100) if total > 0 else 0,
        "neutral_pct": round((neu_count / total) * 100) if total > 0 else 0,
        "negative_pct": round((neg_count / total) * 100) if total > 0 else 0,
        "action_required": negative_reviews
    }

from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestClassifier
import numpy as np

@app.get("/api/churn-risk")
def get_churn_risk():
    if not os.path.exists("data/bookings.csv") or not os.path.exists("data/customers.csv"):
        return {"error": "Data not found. Run generate_data.py first."}
        
    bookings = pd.read_csv("data/bookings.csv")
    customers = pd.read_csv("data/customers.csv")
    
    # Filter only completed bookings
    bookings = bookings[bookings['status'] == 'completed'].copy()
    bookings['date'] = pd.to_datetime(bookings['date'])
    
    # Feature Engineering per customer
    today = datetime.now()
    customer_stats = bookings.groupby('customer_id').agg(
        total_visits=('booking_id', 'count'),
        total_spend=('price', 'sum'),
        last_visit=('date', 'max')
    ).reset_index()
    
    customer_stats['days_since_last_visit'] = (today - customer_stats['last_visit']).dt.days
    customer_stats['average_spend'] = customer_stats['total_spend'] / customer_stats['total_visits']
    
    # Label: Churned if no visit in 60 days
    customer_stats['is_churned'] = (customer_stats['days_since_last_visit'] > 60).astype(int)
    
    # Features for ML
    features = ['total_visits', 'average_spend', 'days_since_last_visit']
    X = customer_stats[features]
    y = customer_stats['is_churned']
    
    # Train a Random Forest model (Normally you'd save/load this, doing it in memory for demo speed)
    model = RandomForestClassifier(n_estimators=50, random_state=42)
    model.fit(X, y)
    
    # Predict probabilities for everyone
    customer_stats['churn_probability'] = model.predict_proba(X)[:, 1]
    
    # Find 'At-Risk' customers: Not yet churned (<= 60 days) but high probability or creeping close (e.g. > 40 days)
    at_risk = customer_stats[
        (customer_stats['is_churned'] == 0) & 
        (customer_stats['days_since_last_visit'] > 40)
    ].sort_values(by='churn_probability', ascending=False)
    
    # Merge with customer details
    at_risk = at_risk.merge(customers, on='customer_id', how='left')
    
    # Format the top 5 at risk
    results = []
    for _, row in at_risk.head(5).iterrows():
        results.append({
            "customer_id": row['customer_id'],
            "name": row['name'],
            "phone": row['phone'],
            "days_since": int(row['days_since_last_visit']),
            "risk_score": int(row['churn_probability'] * 100),
            "total_visits": int(row['total_visits'])
        })
        
    return {
        "total_active": int(len(customer_stats[customer_stats['is_churned'] == 0])),
        "total_churned": int(len(customer_stats[customer_stats['is_churned'] == 1])),
        "at_risk_customers": results
    }

from sklearn.linear_model import LinearRegression

@app.get("/api/forecast")
def get_demand_forecast():
    if not os.path.exists("data/bookings.csv"):
        return {"error": "Data not found."}
        
    bookings = pd.read_csv("data/bookings.csv")
    bookings['date'] = pd.to_datetime(bookings['date'])
    bookings['day_of_week'] = bookings['date'].dt.dayofweek
    
    # Aggregate daily bookings
    daily_demand = bookings.groupby('date').size().reset_index(name='bookings_count')
    daily_demand['day_of_week'] = daily_demand['date'].dt.dayofweek
    
    # Train a simple Linear Regression model on day_of_week
    X = pd.get_dummies(daily_demand['day_of_week'], drop_first=True)
    y = daily_demand['bookings_count']
    
    model = LinearRegression()
    model.fit(X, y)
    
    # Predict next 7 days
    today = datetime.now()
    next_7_days = [today + timedelta(days=i) for i in range(1, 8)]
    
    forecast = []
    days_map = {0: 'Mon', 1: 'Tue', 2: 'Wed', 3: 'Thu', 4: 'Fri', 5: 'Sat', 6: 'Sun'}
    
    highest_demand = 0
    busiest_day = ""
    
    for d in next_7_days:
        dow = d.weekday()
        # Create input array matching dummy variables (days 1 to 6)
        x_pred = [1 if dow == i else 0 for i in range(1, 7)]
        pred_bookings = int(max(1, round(model.predict([x_pred])[0])))
        
        day_name = days_map[dow]
        forecast.append({
            "date": d.strftime('%b %d'),
            "day": day_name,
            "expected_bookings": pred_bookings
        })
        
        if pred_bookings > highest_demand:
            highest_demand = pred_bookings
            busiest_day = day_name
            
    return {
        "forecast": forecast,
        "insight": f"Expect peak demand this upcoming {busiest_day} ({highest_demand} bookings). Consider scheduling additional staff."
    }

from pydantic import BaseModel
import urllib.request
import json
import ssl

ssl_context = ssl._create_unverified_context()
import os
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

class ChatMessage(BaseModel):
    message: str

@app.post("/api/chat")
def chat_with_bot(chat: ChatMessage):
    system_prompt = """You are a warm, welcoming, and highly professional AI receptionist for 'The Beauty Hub Salon And Academy'.

Here is the exact information you know about the business:
- **Owner**: Tarannum Jahan
- **Location**: Bilaspur, Near Nainital Bank, Matkhera, Bilaspur-Uttar Pradesh-244921, Rampur, UP.
- **Phone Numbers / WhatsApp**: 8171537593 or 8077393195
- **Makeup Services & Prices**: 
  - Party Makeup: Normal (₹2000), HD (₹3000), Silicone (₹5000).
  - Engagement Makeup: Normal (₹10000), HD (₹15000), Silicone (₹20000).
  - Bridal & Reception Makeup: Normal (₹15000), HD (₹20000), Silicone (₹30000).
- **Other Services**: Nail Extensions start at ₹2000 for both hands. Skin Treatments start from ₹500 to ₹5000. Hair Chemical Work starts from ₹3000. Hair Styling (₹1500), Facial (₹1800).
- **Service Duration**: Bridal makeup typically takes 2 to 3 hours maximum, depending on the bride's specific demands.
- **Brands Used**: We use only high-end, premium quality international brands (such as MAC, Huda Beauty, Kryolan, etc.) to ensure the most flawless and long-lasting results.
- **Hours**: Open Saturday to Thursday from 9:00 AM to 7:00 PM. 
- **Friday Off Rule**: We are CLOSED on Fridays. However, if anyone has important work (like a wedding or special event), they can call or text us directly on WhatsApp!
- **Amenities**: We happily offer complimentary tea, coffee, and snacks for all our clients!
- **Parking**: We have ample parking available for both cars and bikes!
- **Staffing**: We have a dedicated team of 10 professional staff members available at all times to serve our clients without long waits.
- **Home Visits**: We do offer home visits for makeup and services, but *only* within the local Bilaspur area.
- **Booking & Payment**: Customers can book online via the website. We accept Advance UPI payments or Full Payment at the salon.
- **Refund Policy**: If you cancel your booking within 1 hour of making it by informing us, you will get a full refund of your advance. After 1 hour, refunds are generally not possible because we block that time slot and turn away other clients.
- **Discounts & Offers**: We have a special Welcome Offer (available ONLY if you pay via Advance Payment). We also offer customized discounts for Birthdays, Marriages, and special festive occasions!

**Your Personality & Rules:**
- Be incredibly polite and conversational. Use emojis occasionally (like ✨, ☕, 💇‍♀️, 💖).
- Speak Hindi and English naturally if the customer asks in Hindi/Hinglish (e.g., "Haan bilkul! Hamara salon Bilaspur mein hai...").
- If a customer asks about the owner, speak highly of Tarannum Jahan.
- DO NOT invent any prices or services that aren't listed above.
- **CRITICAL RULE**: If a customer asks a question and you do not know the exact answer from the information above, you MUST reply exactly like this: "Sorry, I don't have that information. For more details, please contact us directly at 8171537593 or 8077393195." """

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={GEMINI_API_KEY}"
    
    payload = {
        "systemInstruction": {
            "parts": [{"text": system_prompt}]
        },
        "contents": [
            {"parts": [{"text": chat.message}]}
        ],
        "generationConfig": {
            "temperature": 0.6
        }
    }
    
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req, context=ssl_context, timeout=30) as response:
            result = json.loads(response.read().decode())
            bot_reply = result['candidates'][0]['content']['parts'][0]['text']
            return {"reply": bot_reply}
    except Exception as e:
        print("Error calling Gemini:", e)
        return {"reply": f"Network Error: Google's AI servers took too long to respond. Please try again!"}




import certifi
from pymongo import MongoClient
from fastapi import Request

# MongoDB Connection
import os
MONGO_URI = os.getenv("MONGO_URI", "")
try:
    mongo_client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
    db = mongo_client["beauty_hub_db"]
except Exception as e:
    print("MongoDB Connection Error:", e)
    db = None

@app.get("/api/db/{collection}")
def get_collection(collection: str):
    if db is None:
        return []
    try:
        doc = db[collection].find_one({"_id": "array_store"})
        if doc and "data" in doc:
            return doc["data"]
        return []
    except Exception as e:
        print("Mongo GET Error:", e)
        return []

@app.post("/api/db/{collection}")
async def set_collection(collection: str, request: Request):
    if db is None:
        return {"success": False}
    try:
        data = await request.json()
        db[collection].update_one(
            {"_id": "array_store"},
            {"$set": {"data": data}},
            upsert=True
        )
        return {"success": True}
    except Exception as e:
        print("Mongo POST Error:", e)
        return {"success": False}


from pydantic import BaseModel
from fastapi import HTTPException

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/auth/login")
async def login(req: LoginRequest):
    import os
    env_email = os.getenv("ADMIN_EMAIL", "serversterkira@gmail.com").strip().lower()
    env_pw = os.getenv("ADMIN_PASSWORD", "Sahil07$").strip()
    
    input_email = req.email.strip().lower()
    input_pw = req.password.strip()

    valid_emails = {env_email, "serversterkira@gmail.com", "admin@thebeautyhub.in"}
    valid_passwords = {env_pw, "Sahil07$", "admin123"}

    # Check primary env pair or known admin credentials
    if (input_email in valid_emails) and (input_pw in valid_passwords):
        return {"token": "secure_admin_jwt_token_12345"}
    
    raise HTTPException(status_code=401, detail="Invalid credentials")

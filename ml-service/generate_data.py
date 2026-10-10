import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
import os

# Ensure data directory exists
os.makedirs('data', exist_ok=True)

# Configuration
NUM_CUSTOMERS = 300
NUM_BOOKINGS = 1200
NUM_REVIEWS = 400

SERVICES = [
    {'name': 'Hair Styling', 'price': 1500},
    {'name': 'Makeup', 'price': 2500},
    {'name': 'Nails', 'price': 800},
    {'name': 'Skin Care', 'price': 1200},
    {'name': 'Bridal Package', 'price': 15000},
    {'name': 'Massage', 'price': 2000},
    {'name': 'Facial', 'price': 1800}
]

# Generate Customers
print("Generating customers...")
customers = []
for i in range(1, NUM_CUSTOMERS + 1):
    join_date = datetime.now() - timedelta(days=random.randint(30, 365))
    customers.append({
        'customer_id': f"CUST_{i:04d}",
        'name': f"Customer {i}",
        'email': f"customer{i}@example.com",
        'phone': f"98765{i:05d}",
        'join_date': join_date.strftime('%Y-%m-%d')
    })
df_customers = pd.DataFrame(customers)
df_customers.to_csv('data/customers.csv', index=False)

# Generate Bookings
print("Generating bookings...")
bookings = []
statuses = ['completed', 'completed', 'completed', 'cancelled', 'no_show']

for i in range(1, NUM_BOOKINGS + 1):
    cust = random.choice(customers)
    service = random.choice(SERVICES)
    # Random date between join date and now
    join_date = datetime.strptime(cust['join_date'], '%Y-%m-%d')
    days_since_join = (datetime.now() - join_date).days
    if days_since_join < 1: days_since_join = 1
    booking_date = join_date + timedelta(days=random.randint(0, days_since_join))
    
    bookings.append({
        'booking_id': f"BKG_{i:05d}",
        'customer_id': cust['customer_id'],
        'service_name': service['name'],
        'date': booking_date.strftime('%Y-%m-%d'),
        'time': f"{random.randint(10, 18):02d}:00",
        'price': service['price'],
        'status': random.choice(statuses) if booking_date < datetime.now() else 'pending',
        'payment_method': random.choice(['pay_advance', 'pay_at_salon'])
    })
df_bookings = pd.DataFrame(bookings)
df_bookings.to_csv('data/bookings.csv', index=False)

# Generate Reviews
print("Generating reviews...")
good_reviews = [
    "Absolutely loved the service! Highly recommend.",
    "The staff was so polite and the results were amazing.",
    "My go-to place for all beauty needs. 5 stars!",
    "Bridal makeup was flawless. Thank you!",
    "Very clean and hygienic. Great experience."
]
neutral_reviews = [
    "It was okay, nothing special.",
    "Service was decent but a bit overpriced.",
    "Had to wait 20 minutes despite booking, but the haircut was fine.",
    "Average experience."
]
bad_reviews = [
    "Terrible experience. The stylist didn't listen to me.",
    "Very unprofessional behavior.",
    "Waste of money. Will not return.",
    "They completely ruined my hair. So disappointed."
]

reviews = []
# Only completed bookings get reviews
completed_bookings = [b for b in bookings if b['status'] == 'completed']
sampled_bookings = random.sample(completed_bookings, min(NUM_REVIEWS, len(completed_bookings)))

for i, b in enumerate(sampled_bookings):
    rating = 5
    
    if rating >= 4:
        text = random.choice(good_reviews)
    elif rating == 3:
        text = random.choice(neutral_reviews)
    else:
        text = random.choice(bad_reviews)
        
    reviews.append({
        'review_id': f"REV_{i+1:04d}",
        'customer_id': b['customer_id'],
        'booking_id': b['booking_id'],
        'rating': rating,
        'review_text': text,
        'date': b['date']
    })
df_reviews = pd.DataFrame(reviews)
df_reviews.to_csv('data/reviews.csv', index=False)

print("Successfully generated customers.csv, bookings.csv, and reviews.csv in ml-service/data/")

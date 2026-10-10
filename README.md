# The Beauty Hub Salon & Academy - AI-Powered Management System

A production-ready, full-stack application built for a real-world salon business, supercharged with modern AI and Machine Learning features to automate operations, predict customer behavior, and drive revenue.

**Developed by: Sahil**

---

## 🏗️ Architecture

This project is built using a modern, scalable architecture designed for high performance and easy deployment.

*   **Frontend (User & Admin Portals):** React.js + Vite, styled with Tailwind CSS & Framer Motion for buttery-smooth animations. Features full dark-mode support and mobile responsiveness.
*   **Database:** IndexedDB (NoSQL browser storage) with an asynchronous client wrapper (`client.ts`) designed to mimic a real database engine. Handles image blobs and 1,000+ relational records (Bookings, Customers, Reviews, Services, Gallery).
*   **AI/ML Microservice:** Python 3 + FastAPI. This service handles all heavy machine learning computations and interfaces directly with the React frontend via REST APIs.

---

## 🤖 Machine Learning Features (The "Insights" Engine)

Instead of just building another CRUD app, I integrated a dedicated Python ML microservice to solve real business problems:

### 1. Generative AI RAG Chatbot (Gemini 3.6 Flash)
*   **The Problem:** The salon owner was losing potential bookings because customers had repetitive questions about pricing, home visits, and bridal package timings.
*   **The Solution:** I built an AI Assistant widget on the customer site. It uses Retrieval-Augmented Generation (RAG) by passing the business's custom rules, prices, and refund policies directly into Google's Gemini API via a highly engineered System Prompt. The bot naturally answers questions in English and Hinglish.

### 2. Natural Language Feedback Sentiment Analysis
*   **The Problem:** Reading through hundreds of customer reviews manually is impossible for a busy owner.
*   **The Solution:** An NLP pipeline (using `TextBlob`) that mathematically scores the polarity of every historical review. It outputs a real-time progress bar in the Admin Panel showing the percentage of Positive, Neutral, and Negative reviews, automatically flagging negative ones for immediate damage control.

### 3. Customer Churn Prediction (Random Forest Classifier)
*   **The Problem:** Salons lose money when regulars quietly stop visiting.
*   **The Solution:** An ML endpoint that aggregates historical bookings to engineer features like *Total Visits*, *Average Spend*, and *Days Since Last Visit*. It trains a `RandomForestClassifier` (via `scikit-learn`) on the fly to predict which customers are mathematically at risk of churning, flagging them in the Admin Panel so the owner can send a retention offer (e.g., 20% off).

### 4. Time-Series Demand Forecasting
*   **The Problem:** The owner struggles with scheduling staff efficiently because demand fluctuates.
*   **The Solution:** A `LinearRegression` model that analyzes the time-series distribution of historical bookings across the days of the week. It predicts the expected booking volume for the next 7 days, plotting it on an interactive chart and generating an actionable text insight (e.g., *"Expect peak demand this Saturday - Consider scheduling additional staff"*).

---

## 🚀 Getting Started

### 1. Frontend (React)
```bash
cd client
npm install
npm run dev
```
The app will be running on `http://localhost:5173`. 
*   **Customer Site:** `/`
*   **Admin Dashboard:** `/admin`

### 2. ML Backend (FastAPI)
```bash
cd ml-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 generate_data.py  # Generates 1,200+ synthetic bookings/reviews for demo
uvicorn main:app --reload --port 8000
```

*(Note: You will need to add a Google Gemini API Key inside `main.py` for the Chatbot to function).*

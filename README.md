# SkillBridge AI 🚀

SkillBridge AI is an AI-powered web application that analyzes a user's resume against a job description and generates an intelligent report highlighting skill gaps, preparation plans, and interview questions.

The system helps users understand how well their resume matches a job role and provides actionable insights to improve their chances of getting hired.

---

## ✨ Features

* 🔐 **User Authentication**

  * Register and login using JWT authentication

* 📄 **Resume Upload**

  * Upload resume in PDF format

* 🤖 **AI Resume Analysis**

  * Resume analyzed using **Google Gemini AI**

* 📊 **Generated Report**

  * Skill gaps
  * Preparation roadmap
  * Technical interview questions
  * Behavioral interview questions

* 💾 **Report Storage**

  * All generated reports are saved in the database

* 📂 **User Dashboard**

  * View previously generated reports

---

## 🛠 Tech Stack

### Frontend

* React
* Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### AI Integration

* Google Gemini API

### Authentication

* JWT (JSON Web Token)
* bcryptjs

### File Handling

* Multer
* pdf-parse

---


## ⚙️ Installation

### 1️⃣ Clone the repository

```
git clone https://github.com/yourusername/skillbridgeAI.git
```

### 2️⃣ Navigate to project

```
cd skillbridgeAI
```

### 3️⃣ Install backend dependencies

```
cd backend
npm install
```

### 4️⃣ Install frontend dependencies

```
cd ../frontend
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the backend folder.

Example:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

---

## ▶️ Run the Application

### Start Backend

```
cd backend
npm run dev
```

### Start Frontend

```
cd frontend
npm start
```

---

## 🧠 How It Works

1. User registers and logs in
2. User uploads a resume (PDF)
3. User enters job description
4. Resume text is extracted from PDF
5. Data is sent to Gemini AI
6. AI generates analysis report
7. Report is stored in MongoDB
8. User can view report anytime from dashboard

---

## 📊 Future Improvements

* Resume Match Score
* Download Report as PDF
* Skill Gap Visualization
* AI Chat with Resume
* Resume Improvement Suggestions

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repository and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Sahil Sameer Siddique**

GitHub: https://github.com/SahilSameer18

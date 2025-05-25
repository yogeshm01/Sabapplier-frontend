# 📄 DocAI – Intelligent Document Management Portal

Welcome to **DocAI**, an intelligent document management system where users can securely upload, manage, and interact with their documents using AI-powered question answering.

---

## 🌟 Features

- 🔐 User Authentication (JWT-based)
- 📤 Upload, update, and delete PDF documents
- 🧠 Ask questions about your documents using AI
- 🗂️ Organized  for document management
- 🎨 Clean, responsive UI built with React and Tailwind CSS

---

## 🛠 Tech Stack

### 🔹 Frontend
- [React.js](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Toastify](https://fkhadra.github.io/react-toastify/)
- Hosted on **Vercel**

### 🔹 Backend
- [Django](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- JWT Authentication (`djangorestframework-simplejwt`)
- Hosted on **Render.com**

### 🔹 AI Integration
- [Gemini API (Google AI)](https://ai.google.dev/) or alternative model
- Text extraction using built-in parsing (OCR if needed)

---

## ⚙️ How to Run Locally

### 🔹 Backend (Django)

```bash
git clone https://github.com/YOUR_USERNAME/docai-portal.git
cd docai-portal/backend
python -m venv venv
source venv/bin/activate  # For Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

- Make sure to set your .env file with:
SECRET_KEY=your-secret
DEBUG=True
GEMINI_API_KEY=your-gemini-api-key
```

### 🔹 Frontend (React)

```bash
git clone https://github.com/YOUR_USERNAME/docai-portal.git
cd docai-portal/frontend
npm install
npm start
```

### 🌐 Hosting Links

- Frontend: [https://sabapplier-frontend.vercel.app/](https://sabapplier-frontend.vercel.app/)
- Backend: [https://sabapplier-backend.onrender.com](https://sabapplier-backend.onrender.com)

## 📸 Screenshots

### 🔐 Login Page
![Login Page]((https://postimg.cc/s1NPWzmF))

### 🧠 Home Page
![AI Question](https://postimg.cc/bGYct1Yw)

### 📁 Dashboard
![Dashboard](https://postimg.cc/6yKHqtp9)

### 👨‍💻 Developer
- Made with ❤️ by [Yogesh Mishra](https://github.com/yogeshm01)


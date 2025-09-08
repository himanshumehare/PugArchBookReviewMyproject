📚 Book Review Platform

A full-stack web application that allows users to register, browse books, and leave reviews. This platform demonstrates proficiency in Node.js, Express, MongoDB, and React. Users can create accounts, view books, rate them, and add comments.

🚀 Features
🔒 Authentication

Secure registration and login using JWT and bcrypt

Auth-protected routes for adding reviews

📘 Book System

List of all books with title, author, and average rating

Detailed book pages including full description and reviews

Ability to add new reviews with rating and comments

💬 Reviews

Each user can review a book once

Reviews display reviewer name, rating (1–5 stars), and comment

Average rating calculated dynamically

🔍 Search & Filter

Real-time search bar to filter books by title or author

🧑‍💻 User Experience

Authentication forms (Login & Register)

Responsive UI using TailwindCSS or Material UI

Optional: "My Reviews" section for users to see their own reviews

🛠️ Tech Stack
🔙 Backend

Node.js

Express.js

MongoDB with Mongoose

JWT for token-based authentication

bcrypt for password hashing
book-review-backend/
├── controllers/        # Logic for auth, books, reviews
├── models/             # Mongoose models (User, Book, Review)
├── routes/             # API routes
├── middleware/         # Auth middleware
├── config/             # DB connection
├── .env                # Environment variables
├── server.js           # Main entry point
└── package.json

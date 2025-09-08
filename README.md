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
🔜 Frontend

React.js

Axios for API requests

React Router for navigation

TailwindCSS or Material UI for styling
book-review-frontend/
├── src/
│   ├── pages/          # Register, Login, BookList, BookDetails
│   ├── components/     # Navbar, BookCard, ReviewForm, etc.
│   ├── services/       # Axios API service
│   ├── App.js
│   └── index.js
├── tailwind.config.js  # Tailwind config (if used)
├── .env
└── package.json

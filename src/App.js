import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { authAPI, booksAPI, reviewsAPI } from './api/client';

// Auth Context
const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = (userData, userToken) => {
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return React.useContext(AuthContext);
}

// Star Rating Component
function StarRating({ value = 0, onChange, readOnly = false }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex gap-1">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          className={`text-2xl ${s <= value ? 'text-yellow-400' : 'text-gray-300'}`}
          onClick={() => !readOnly && onChange?.(s)}
          disabled={readOnly}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// Navbar Component
function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">📚 Book Reviews</Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <span>Hi, {user.name}!</span>
              <Link to="/my-reviews" className="hover:underline">My Reviews</Link>
              <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// Login Page
function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      console.log('Sending login data:', form);
      const response = await authAPI.login(form);
      console.log('Login response:', response);
      login(response.user, response.token);
      navigate('/');
      setMessage('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      setMessage(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-center ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

// Register Page
function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      console.log('Sending registration data:', form);
      const response = await authAPI.register(form);
      console.log('Registration response:', response);
      setMessage('Registration successful! You can now login.');
      setForm({ name: '', email: '', password: '' });
    } catch (error) {
      console.error('Registration error:', error);
      setMessage(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-center ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

// Books List Page
function BooksList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const data = await booksAPI.getAll();
      setBooks(data);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <div className="text-xl">Loading books...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📚 Books</h1>
        <input
          className="w-64 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map(book => (
          <div key={book.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{book.title}</h2>
            <p className="text-gray-600 mb-2">by {book.author}</p>
            <p className="text-sm text-gray-500 mb-3">{book.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StarRating value={Math.floor(book.averageRating || 0)} readOnly />
                <span className="text-sm font-medium">{book.averageRating || 0}/5</span>
              </div>
              <Link
                to={`/books/${book.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Book Details Page
function BookDetails() {
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadBookDetails();
  }, []);

  const loadBookDetails = async () => {
    try {
      const bookId = window.location.pathname.split('/').pop();
      const data = await booksAPI.getById(bookId);
      setBook(data);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error loading book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user || !newReview.comment.trim()) return;

    try {
      await reviewsAPI.create({
        bookId: book.id,
        rating: newReview.rating,
        comment: newReview.comment
      });
      
      setNewReview({ rating: 5, comment: '' });
      setMessage('Review submitted successfully!');
      await loadBookDetails(); // Reload book details
    } catch (error) {
      setMessage(error.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (!book) {
    return <div className="text-center mt-8">Book not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
        <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
        <p className="text-gray-700 mb-6">{book.description}</p>
        
        <div className="flex items-center gap-2 mb-6">
          <StarRating value={Math.floor(book.averageRating || 0)} readOnly />
          <span className="text-lg font-medium">Average Rating: {book.averageRating || 0}/5</span>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>
          <div className="space-y-4 mb-8">
            {reviews.map(review => (
              <div key={review.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center gap-2 mb-2">
                  <StarRating value={review.rating} readOnly />
                  <span className="font-medium">{review.user?.name || 'Anonymous'}</span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
          </div>

          {user ? (
            <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Add Your Review</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rating:</label>
                <StarRating 
                  value={newReview.rating} 
                  onChange={(rating) => setNewReview({...newReview, rating})} 
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Comment:</label>
                <textarea
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  placeholder="Share your thoughts about this book..."
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Submit Review
              </button>
              {message && (
                <p className={`mt-2 text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
              )}
            </form>
          ) : (
            <p className="text-center text-gray-600 bg-gray-50 p-4 rounded-lg">
              Please <Link to="/login" className="text-blue-600 hover:underline">login</Link> to add a review.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// My Reviews Page
function MyReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserReviews();
    }
  }, [user]);

  const loadUserReviews = async () => {
    try {
      const data = await reviewsAPI.getUserReviews(user.id);
      setReviews(data);
    } catch (error) {
      console.error('Error loading user reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">My Reviews</h1>
        <p className="text-gray-600">Please <Link to="/login" className="text-blue-600 hover:underline">login</Link> to view your reviews.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="text-xl">Loading your reviews...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Reviews</h1>
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{review.book?.title}</h3>
              <StarRating value={review.rating} readOnly />
            </div>
            <p className="text-gray-600 mb-2">by {review.book?.author}</p>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-center text-gray-600 py-8">You haven't written any reviews yet.</p>
        )}
      </div>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<BooksList />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-reviews" element={<MyReviews />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
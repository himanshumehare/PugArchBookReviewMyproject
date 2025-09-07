const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

export const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = { 
    'Content-Type': 'application/json', 
    ...(options.headers || {}) 
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    console.log('Sending request with token:', token.substring(0, 20) + '...');
  } else {
    console.log('No token found in localStorage');
  }
  
  console.log('API Request:', `${API_BASE}${path}`, { headers, ...options });
  
  try {
    const res = await fetch(`${API_BASE}${path}`, { 
      ...options, 
      headers 
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      console.error('API Error Response:', error);
      throw new Error(error.message || `Request failed: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  register: (userData) => apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  login: (credentials) => apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
};

// Books API calls
export const booksAPI = {
  getAll: () => apiFetch('/books'),
  getById: (id) => apiFetch(`/books/${id}`)
};

// Reviews API calls
export const reviewsAPI = {
  create: (reviewData) => apiFetch('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData)
  }),
  getByBookId: (bookId) => apiFetch(`/reviews/${bookId}`),
  getUserReviews: (userId) => apiFetch(`/reviews/user/${userId}`)
};

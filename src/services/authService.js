import axios from 'axios';

const STORAGE_KEY = 'tutorial_user';
const TOKEN_KEY = 'tutorial_token';
const API_URL = (import.meta.env.VITE_API_URL) || 'http://localhost:3101'; // set VITE_API_URL in frontend .env if needed

function getUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || null;
}

export default {
  async login({ email, password }) {
    // client-side validation (same rules)
    const em = (email || '').toLowerCase();
    if (!(em.endsWith('@gmail.com') || em.endsWith('@eagles.oc.edu'))) {
      throw new Error('Email must end with @gmail.com or @eagles.oc.edu');
    }
    if ((password || '').length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    // call backend login endpoint
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });
      // expected backend response: { token: 'jwt', user: { email, ... } }  (adjust to your backend)
      const { token, user } = res.data;
      if (token) localStorage.setItem(TOKEN_KEY, token);
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      window.dispatchEvent(new Event('auth-changed'));
      return user || { email };
    } catch (err) {
      // extract useful message
      const msg = err?.response?.data?.message || err.message || 'Login failed';
      throw new Error(msg);
    }
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event('auth-changed'));
  },

  getUser,
  getToken,
  isAuthenticated() {
    return !!getToken();
  },
};

import axios from 'axios';


const STORAGE_KEY = 'tutorial_user';
const TOKEN_KEY = 'tutorial_token';
const API_URL = (import.meta.env.VITE_API_URL) || 'http://localhost:3000'; // default fallback

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

    // Decide endpoint: prefer relative path so Vite proxy (vite.config.js) handles CORS.
    // If proxy is not desired you can force absolute by setting FORCE_ABSOLUTE_API=1 in env and rebuilding.
    const FORCE_ABSOLUTE = import.meta.env.VITE_FORCE_ABSOLUTE_API === '1';
    const endpoint = FORCE_ABSOLUTE ? `${API_URL}/auth/login` : '/auth/login';

    // call backend login endpoint
    try {
      const res = await axios.post(endpoint, { email, password }, { withCredentials: true });
      // expected backend response: { token: 'jwt', user: { email, ... } }  (adjust to your backend)
      const { token, user } = res.data;
      if (token) localStorage.setItem(TOKEN_KEY, token);
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      window.dispatchEvent(new Event('auth-changed'));
      return user || { email };
    } catch (err) {
        // Log full error to the browser console for debugging
        // (Network Error commonly means the backend is unreachable or the request was blocked by CORS)
        // eslint-disable-next-line no-console
        console.error('authService.login error:', err);

        // If there is no response, this is likely a network/CORS issue (server not running or blocked)
        if (!err || !err.response) {
          throw new Error(`Network Error: could not reach backend at ${API_URL}. Is the backend running and configured to allow CORS from the frontend (http://localhost:5173)?`);
        }

        // If 404, guide user on likely causes.
        if (err.response.status === 404) {
          throw new Error('Login endpoint not found (404). Confirm backend defines POST /auth/login or adjust authService endpoint.');
        }

        // Build richer error info for other statuses
        const status = err.response.status;
        const serverMsg = err.response.data?.message || err.response.data?.error || null;
        const fallback = err.message || 'Login failed';
        let composed = `Login failed (HTTP ${status})`;
        if (serverMsg) composed += `: ${serverMsg}`; else composed += `: ${fallback}`;
        // Optionally include raw payload for debugging (comment out in prod)
        if (import.meta.env.DEV && err.response.data && typeof err.response.data === 'object') {
          // eslint-disable-next-line no-console
          console.debug('Raw backend error payload:', err.response.data);
        }
        throw new Error(composed);
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

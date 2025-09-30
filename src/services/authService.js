const STORAGE_KEY = 'tutorial_user'

function getUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function validateCredentials({ email, password }) {
  const em = (email || '').toLowerCase()
  const emailOk = em.endsWith('@gmail.com') || em.endsWith('@eagles.oc.edu')
  const passOk = (password || '').length >= 8
  if (!emailOk) throw new Error('Email must end with @gmail.com or @eagles.oc.edu')
  if (!passOk) throw new Error('Password must be at least 8 characters')
}

export default {
  login({ email, password }) {
    return new Promise((resolve, reject) => {
      try {
        validateCredentials({ email, password })
      } catch (err) {
        reject(err)
        return
      }

      setTimeout(() => {
        const user = { email }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
        try { window.dispatchEvent(new Event('auth-changed')) } catch (e) {}
        resolve(user)
      }, 250)
    })
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY)
    try { window.dispatchEvent(new Event('auth-changed')) } catch (e) {}
  },

  getUser,
  isAuthenticated() {
    return !!getUser()
  },
}

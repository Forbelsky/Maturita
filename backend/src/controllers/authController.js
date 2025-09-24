// src/controllers/authController.js
const { login: authLogin, logout: authLogout } = require('../services/authService.js')

function readTokenFromAuthHeader(req) {
  const auth = req.headers.authorization || ''
  const [scheme, token] = auth.split(' ')
  if (scheme && scheme.toLowerCase() === 'bearer' && token) return token
  return null
}

async function login(req, res) {
  try {
    const { username, password } = req.body || {}
    const result = await authLogin({ username, password })
    res.json(result) // { token, user }
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Login failed' })
  }
}

async function logout(req, res) {
  try {
    const token = readTokenFromAuthHeader(req)
    await authLogout(token)
    res.json({ ok: true })
  } catch (e) {
    res.json({ ok: true })
  }
}

module.exports = {
  login,
  logout,
}

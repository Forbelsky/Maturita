// services/authService.js
const crypto = require('crypto')
const { findByUsername, findById, sha256 } = require('../repositories/userRepository.js')

// In-memory token store: token -> userId
const tokenStore = new Map()

function makeToken() {
  return crypto.randomBytes(24).toString('hex')
}

/**
 * Login:
 * - Vyžaduje username a password (email se nepodporuje).
 * - Password se hashne a porovná s uloženým hashem.
 * - Při úspěchu se vygeneruje token a uloží do tokenStore.
 */
async function login({ username, password }) {
  if (!username || !password) {
    const err = new Error('Missing credentials')
    err.status = 400
    throw err
  }

  const user = findByUsername(username)
  if (!user) {
    const err = new Error('Invalid credentials')
    err.status = 401
    throw err
  }

  const inputHash = sha256(password)
  if (inputHash !== user.passwordHash) {
    const err = new Error('Invalid credentials')
    err.status = 401
    throw err
  }

  const token = makeToken()
  tokenStore.set(token, user.id)
  return { token, user: user.toPublicJSON() }
}

async function logout(token) {
  if (tokenStore.has(token)) {
    tokenStore.delete(token)
  }
  return { ok: true }
}

async function getUserFromToken(token) {
  const userId = tokenStore.get(token)
  if (!userId) return null
  const u = findById(userId)
  return u ? u.toPublicJSON() : null
}

module.exports = {
  login,
  logout,
  getUserFromToken,
}

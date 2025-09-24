// repositories/userRepository.js
const crypto = require('crypto')
const { User } = require('../entities/User.js')

// Jednoduchý hash (sha256) – pro reálnou aplikaci použijte bcrypt/argon2.
function sha256(input) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex')
}

// In-memory "databáze": uživatel admin s heslem "heslo"
const USERS = [
  new User({
    id: '1',
    username: 'admin',
    name: 'Administrator',
    roles: ['USER', 'ADMIN'],
    passwordHash: sha256('heslo'),
  }),
]

function findByUsername(username) {
  const u = USERS.find((x) => x.username.toLowerCase() === String(username).toLowerCase())
  return u || null
}

function findById(id) {
  const u = USERS.find((x) => x.id === id)
  return u || null
}

module.exports = {
  findByUsername,
  findById,
  sha256, // export pro service (re-use)
}

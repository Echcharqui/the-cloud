require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    select: false, // exclude password from query results by default
    default: null
  },
  username: {
    type: String,
    unique: true,
    required: true
  }
}, {
  timestamps: true
})

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next()

  // Generate a salt
  const saltRounds = parseInt(process.env.SALT || 10) // Default to 10 if not specified in environment
  // Hash the password using the salt
  this.password = await bcrypt.hash(this.password, saltRounds)

  next()
})

module.exports = mongoose.model('User', userSchema)

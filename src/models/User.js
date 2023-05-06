import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'
import validate from 'validator'

const userSchema = new Schema({
  fname: {
    type: String,
    trim: true,
    lower: true,
    required: [true, 'User should have first name'],
  },
  lastname: {
    type: String,
    trim: true,
    lower: true,
    required: [true, 'User should have last name'],
  },
  email: {
    type: String,
    trim: true,
    lower: true,
    required: [true, 'User should have unique email'],
    unique: true,
    validate: [validate.isEmail, 'Please enter a valid email'],
  },
  cart: Object,
  password: {
    type: String,
    trim: true,
    lower: true,
    required: [true, 'User must have a password'],
    minLength: [8, 'Password must be atleast 8 characters long'],
  },
  confirmPass: {
    type: String,
    trim: true,
    lower: true,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (confirmPass) {
        return confirmPass === this.password // if true then we proceed otherwise we will throw error
      },
      message: "password doesn't matches",
    },
  },
  passChangedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

// creating a PRE middleware to encrypt the pass before storing to DB
userSchema.pre('save', async function (next) {
  // checking if password modified or not
  if (!this.isModified('password')) return next()

  // encrypting the password for our users security
  this.password = await bcrypt
    .hash(this.password, 13)
    .then((hashedPass) => hashedPass)

  this.confirmPass = undefined

  next()
})

// An instance methods
userSchema.methods.checkPassword = function (userPass) {
  return bcrypt.compare(userPass, this.password)
}

userSchema.methods.isPasswordChangedAfterTokenCreation = function (
  JWTTimestamp
) {
  if (!this.passChangedAt) return false

  const changedTime = new Date(this.passChangedAt).getTime() / 1000 // converting in seconds

  return changedTime > JWTTimestamp
}

export const UserModel = model('swagUsers', userSchema)

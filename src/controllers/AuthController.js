import bcrypt from 'bcryptjs'
import CusError from '../utils/cusError.js'
import JWT from 'jsonwebtoken'
import { UserModel } from '../models/User.js'

export const userSignUp = async (req, res, next) => {
  try {
    // getting credientials from users
    const { fname, lname, pass, confirmPass, email } = req.body

    const user = await UserModel.create({
      fname: fname,
      lastname: lname,
      password: pass,
      confirmPass: confirmPass,
      email,
    })

    // generating JSONToken
    const authToken = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })

    res.status(201).json({
      status: 'Success✅',
      statusCode: 201,
      credientials: {
        id: user._id,
        email: user.email,
        fname: user.fname,
        authToken,
      },
    })
  } catch (err) {
    next(err)
  }
}

export const userLogIn = async (req, res, next) => {
  try {
    // Getting user credientials
    const { email, pass } = req.body

    if (!(email && pass))
      throw new CusError('Please enter both email and password', 400)

    // finding user
    const user = await UserModel.findOne({ email })

    const passIsCorrect = user && (await user.checkPassword(pass))

    if (!passIsCorrect)
      throw new CusError('Please enter correct email or pass', 401)

    // generating new JWT and logging user in
    const authToken = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })

    res.status(201).json({
      status: 'Success✅',
      statusCode: 201,
      credientials: {
        id: user._id,
        email: user.email,
        fname: user.fname,
        authToken,
      },
    })
  } catch (err) {
    next(err)
  }
}

export const verifyUser = async (req, res, next) => {
  try {
    // 1) extracting jwt
    let token = req.headers.authorization

    if (token && token.startsWith('bearer')) {
      // extracting real token
      token = token.split(' ')[1]
    }

    // checking there is any token
    if (!token) throw new CusError('Please enter a valid token', 404)

    // 2) verifying JWT
    const decodeJWT = JWT.verify(token, process.env.JWT_SECRET)

    // 3) extracting userId from JWT and checking if user exists or not
    const user = await UserModel.findById(decodeJWT.id)

    if (!user) throw new CusError('This User no longer exist.', 404)

    // 4) checking for any password changes from user
    const passChanged = user.isPasswordChangedAfterTokenCreation(decodeJWT.iat)

    if (passChanged)
      throw new CusError(
        'User changed his/her password, Please log in again',
        401
      )

    // 5) USER VERIFIED | Adding user to req to later access in any routes that need this info
    req.user = user

    // passing request further
    next()
  } catch (err) {
    next(err)
  }
}

// verifying user has authentic key or not
export const verifyKey = async (req, res, next) => {
  try {
    const key = req.headers.apikey

    const isAuth = await bcrypt
      .compare(key, process.env.SERVER_AUTH_KEY)
      .then((isAuth) => isAuth)

    if (!isAuth)
      return next(
        new CusError(
          'Un-Authorized⚠️: Key received is not valid❗ Please try again.',
          401
        )
      )

    next()
  } catch (err) {
    next(err)
  }
}

export const sendAuthUser = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'Success✅',
      statusCode: 200,
      credientials: {
        username: req.user.fname,
        id: req.user._id,
        email: req.user.email,
      },
    })
  } catch (err) {
    next(err)
  }
}

export const addToCart = async (req, res, next) => {
  try {
    const userID = req.user._id

    await UserModel.findByIdAndUpdate(
      userID,
      { $set: { cart: req.body } },
      { new: true }
    )

    res.status(201).json({
      status: 'Success✅',
      statusCode: 200,
      message: 'Cart modified successfully',
    })
  } catch (err) {
    next(err)
  }
}

export const getCart = async (req, res, next) => {
  try {
    const cart = req.user.cart

    res.status(200).json({
      status: 'Success✅',
      statusCode: 200,
      data: {
        cart,
      },
    })
  } catch (err) {
    next(err)
  }
}

// 8882749356 - rajnisctechnologies@gmail.com node.js, React.js
// 2249395458
// 8123456789
// career@destinyhrgroup.com
// 9517773636
// 7018442721

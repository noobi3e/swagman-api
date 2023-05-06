import express from 'express'
import bodyParser from 'body-parser'
import { resolve } from 'path'
import CusError from './utils/cusError.js'
import globalErrController from './controllers/globalErrController.js'
import { verifyKey } from './controllers/AuthController.js'
import productRoutes from './routes/products-route.js'
import userRoutes from './routes/user-routes.js'
import cors from 'cors'

const app = express()

// enabling cors
app.use(cors())

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*')
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE')
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Content-Type,Authorization,apikey'
//   )

//   next()
// })

// parsing json/form-data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// serving some files static for ex images
app.use(express.static(resolve('./src/public')))

// verifying user key
app.use(verifyKey)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/users', userRoutes)

// adding a middleware thats check if user has original API key or not
// app.use(verifyKey) // NEED TO BE DONE IMP

// handling unhandled route
app.use((req, res, next) => {
  next(
    new CusError(
      `API doesn't have any information for ${
        req.method
      } request on ( ${req.get('host')}:${req.url} ) route`,
      404
    )
  )
})

// creating a global error handler
app.use(globalErrController)

export default app

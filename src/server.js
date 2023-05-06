console.clear()
import app from './app.js'
import mongoose from 'mongoose'
import dotEnv from 'dotenv'
import { resolve } from 'path'

// configuring env variables
dotEnv.config({ path: resolve('./src/config.env') })

const dbLink = process.env.ATLAS_LINK.replace(
  '<PASSWORD>',
  process.env.ATLAS_PASS
)

const port = process.env.PORT || 7001

// connecting to mongoDB
mongoose.connect(dbLink).then(() => {
  console.log('MongoDB Atlas connected✅')

  app.listen(port, () =>
    console.log(`API is running on http://localhost:${port}`)
  )
})

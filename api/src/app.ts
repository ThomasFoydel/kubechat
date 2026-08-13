import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'

import { config } from './config/env'
import apiRoutes from './routes'

const app = express()

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        config.corsOrigins.includes(origin)
      ) {
        callback(null, true)
        return
      }

      callback(new Error('Not allowed by CORS'))
    },
    credentials: true
  })
)

app.use(express.json())

app.use(cookieParser())

app.use('/api/v1', apiRoutes)

export default app

import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/boardRoute'
import { cardRoute } from '~/routes/v1/cardRoute'
import { columnRoute } from '~/routes/v1/columnRoute'
import { userRoute } from './userRoute'

const Router = express.Router()

/** Check APIs v1/status */
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' })
})

/** Board APIs */
Router.use('/boards', boardRoute)

/** Column APIs */
Router.use('/columns', columnRoute)

/** Cards APIs */
Router.use('/cards', cardRoute)

/** User APIs */
Router.use('/users', userRoute)


export const APIs_V1 = Router

// Redux: State management tool
import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoard.slice'


export const store = configureStore({
  reducer: {
    activeBoard: activeBoardReducer
  }
})

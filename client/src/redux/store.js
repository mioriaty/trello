// Redux: State management tool
import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoard.slice'
import { userReducer } from './user/user.slice'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'
import { combineReducers } from 'redux'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user']
}

const rootReducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer
})

const persistedReducers = persistReducer(persistConfig, rootReducers)

export const store = configureStore({
  reducer: persistedReducers
})

export const persistor = persistStore(store)

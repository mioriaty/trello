import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { API_ROOT } from '~/utils/constants'
import fetcher from '~/utils/fetcher'

const initialState = {
  currentUser: null
}

export const loginUserAPI = createAsyncThunk('user/loginUserAPI', async (data) => {
  const response = await fetcher.post(`${API_ROOT}/v1/users/login`, data)
  return response.data
})

export const logoutUserAPI = createAsyncThunk('user/logoutUserAPI', async (showSuccessMessage = true) => {
  const response = await fetcher.delete(`${API_ROOT}/v1/users/logout`)
  if (showSuccessMessage) {
    toast.success(response.data.message)
  }
  return response.data
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      state.currentUser = action.payload
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      state.currentUser = null
    })
  }
})

export const { setCurrentUser } = userSlice.actions

export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer

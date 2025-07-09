import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
import { activeBoardSlice } from './activeBoard.slice'

export const fetchBoardDetailsAPI = createAsyncThunk('activeBoard/fetchBoardDetailsAPI', async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  // Lưu ý: axios sẽ trả kết quả về qua property của nó là data
  return response.data
})


export const { updateCurrentActiveBoard } = activeBoardSlice.actions

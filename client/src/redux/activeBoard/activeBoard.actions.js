import { createAsyncThunk } from '@reduxjs/toolkit'

import { API_ROOT } from '~/utils/constants'
import fetcher from '~/utils/fetcher'

export const fetchBoardDetailsAPI = createAsyncThunk('activeBoard/fetchBoardDetailsAPI', async (boardId) => {
  const response = await fetcher.get(`${API_ROOT}/v1/boards/${boardId}`)
  return response.data
})

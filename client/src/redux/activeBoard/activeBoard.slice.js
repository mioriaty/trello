import { createSlice } from '@reduxjs/toolkit'
import { fetchBoardDetailsAPI } from './activeBoard.actions'
import { mapOrder } from '~/utils/sorts'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

const initialState = {
  currentActiveBoard: null
}

export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      const board = action.payload
      state.currentActiveBoard = board
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      let board = action.payload

      // Sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con (video 71 đã giải thích lý do ở phần Fix bug quan trọng)
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => {
        // Khi f5 trang web thì cần xử lý vấn đề kéo thả vào một column rỗng (Nhớ lại video 37.2, code hiện tại là video 69)
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // Sắp xếp thứ tự các cards luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con (video 71 đã giải thích lý do ở phần Fix bug quan trọng)
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      state.currentActiveBoard = board
    })
  }
})


export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

export const activeBoardReducer = activeBoardSlice.reducer

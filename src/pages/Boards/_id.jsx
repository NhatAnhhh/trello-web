/* eslint-disable no-console */
import { Container } from '@mui/system'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatter'
import { isEmpty } from 'lodash'

function Board() {

  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '661e42bcc5672753daec14e8'

    //call API
    fetchBoardDetailsAPI(boardId).then(board => {
      board.columns.forEach(column => {

        // khi tao mot clumn moi thi chua co card
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(board)._id]
        }
      })
      setBoard(board)
    })
  }, [])

  // goi API va tao moi data column, lam lai data state board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    // console.log(createdColumn)
    //khi tao moi column thi chua co card, can xu ly
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    console.log([generatePlaceholderCard(createdColumn)])
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]
    console.log([generatePlaceholderCard(createdColumn)._id])

    // cap nhat state board
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    // console.log(createdCard)

    // cap nhat state board

    const newBoard = { ...board }
    const updateToColumn = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (updateToColumn) {
      updateToColumn.cards.push(createdCard)
      updateToColumn.cardOrderIds.push(createdCard._id)
    }

    setBoard(newBoard)
  }

  return (
    <>
      <Container disableGutters maxWidth = {false} sx={{ height: '100vh' }}>
        <AppBar/>
        <BoardBar board={board}/>
        <BoardContent
          board={board}
          createNewColumn={createNewColumn}
          createNewCard = {createNewCard}
        />
      </Container>
    </>
  )
}

export default Board
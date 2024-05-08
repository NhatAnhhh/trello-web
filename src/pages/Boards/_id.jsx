/* eslint-disable no-console */
import { Container } from '@mui/system'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI, createNewColumnAPI,
  createNewCardAPI,
  updateDetailBoardsAPI,
  updateDetailColumnAPI,
  deleteDetailColumnAPI,
  moveCardToDifferentToColumnAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatter'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'
import { Box } from '@mui/system'
import CircularProgress from '@mui/material/CircularProgress'
import { Typography } from '@mui/material'
import { toast } from 'react-toastify'


function Board() {

  const [board, setBoard] = useState(null)
  console.log('🚀 ~ Board ~ board:', board)

  useEffect(() => {
    const boardId = '6624e070980905aace078cf5'

    //call API
    fetchBoardDetailsAPI(boardId).then(board => {
      // Sap xep thu tu cac column truoc khi chuyen du lieu xuong xuong ben duoi cac compent con
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => {

        if (isEmpty(column.cards)) {
        // khi tao mot clumn moi thi chua co card

          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(board)._id]
        }
        else {
        // Sap xep thu tu cac card truoc khi chuyen du lieu xuong xuong ben duoi cac compent con
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
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

    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]


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

    // cap nhat state board
    const newBoard = { ...board }
    const updateToColumn = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (updateToColumn) {
      if (updateToColumn.cards.some(card => card.FE_PlaceholderCard))
      {
        updateToColumn.cards = [createdCard]
        updateToColumn.cardOrderIds = [createdCard._id]
      }
      else {
        updateToColumn.cards.push(createdCard)
        updateToColumn.cardOrderIds.push(createdCard._id)
      }
    }

    setBoard(newBoard)
  }


  // function nay co nhiem vu goi API va xu ly khi keo tha cloumn
  const moveColumns = async (dndOrderedColums) => {
    //update cho chuan du lieu state board
    const dndOrderedColumsIds = dndOrderedColums.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColums
    newBoard.columnOrderIds = dndOrderedColumsIds
    setBoard(newBoard)

    //Call API
    await updateDetailBoardsAPI(newBoard._id, { columnOrderIds: dndOrderedColumsIds })
  }

  // function nay co nhiem vu goi API va xu ly khi keo tha cloumn, Chi can goi API de update mang cardOrderIds cua column chua no
  const moveCardInTheSameColumn = (dndOrderredCards, dndOrderredCardIds, columnId) => {
    //update cho chuan du lieu state board
    const newBoard = { ...board }
    const updateToColumn = newBoard.columns.find(column => column._id === columnId)
    if (updateToColumn) {
      updateToColumn.cards = dndOrderredCards
      updateToColumn.cardOrderIds = dndOrderredCardIds
    }

    setBoard(newBoard)

    //call API
    updateDetailColumnAPI(columnId, { cardOrderIds: dndOrderredCardIds })

  }

  // function nay co nhiem vu goi API va xu ly khi keo tha card giua column khac nhau
  const moveCardToDifferentToColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColums) => {

    const dndOrderedColumsIds = dndOrderedColums.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColums
    newBoard.columnOrderIds = dndOrderedColumsIds
    setBoard(newBoard)

    let prevCardOrderIds = dndOrderedColums.find(c => c._id === prevColumnId)?.cardOrderIds
    if (prevCardOrderIds [0].includes('placeholder-card') ) prevCardOrderIds = []
    //Call API
    moveCardToDifferentToColumnAPI ({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColums.find(c => c._id === nextColumnId)?.cardOrderIds
    }
    )
  }

  const deleteColumnDetails = ( columnId ) => {
    //Update lai cho chuan du lieu
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter(column => column._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== columnId)
    setBoard(newBoard)
    //Call API
    deleteDetailColumnAPI(columnId).then(res => {
      toast.success(res?.deleteResult)
    })
  }

  if (!board) {
    return (
      <Box sx={{ display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        width: '100vw',
        height:'100vh'
      }}>
        <CircularProgress />
        <Typography > Board Loading... </Typography>
      </Box>
    )
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
          moveColumns = {moveColumns}
          moveCardInTheSameColumn = {moveCardInTheSameColumn}
          moveCardToDifferentToColumn = {moveCardToDifferentToColumn}
          deleteColumnDetails = {deleteColumnDetails}
        />
      </Container>
    </>
  )
}

export default Board
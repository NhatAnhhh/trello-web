import { Box } from '@mui/system'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext,
  DragOverlay,
  // MouseSensor,
  // TouchSensor,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
  closestCorners,
  pointerWithin,
  // rectIntersection,
  getFirstCollision
  // closestCenter
} from '@dnd-kit/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'

import { generatePlaceholderCard } from '~/utils/formatter'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, isEmpty } from 'lodash'

const ACTIVE_DRAG_ITEM_TYPE ={
  COLUMN: 'ACTIVE_DRAG_ITEM_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_CARD'
}

function BoardContent({ board, createNewColumn, createNewCard, moveColumns }) {
  // Yeu cau chuot di chuyen 10px thi moi dc kich hoat event, fix TH click bi goi envet
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  // nhan giu 250ms va di chuyen trn lech 5px thi moi kich hoat event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })

  // uu tien su dung ket hop 2 loai sensors la mouse va touch de co trai nghiem tren mobile tot nhat, ko bug
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState( [] )
  //cung mot thoi diem chi co mot phan tu duoc keo (column or card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  //Diem va cham cuoi cung truoc do (xu ly thuat toan va cham)
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  //tim mot column theo card Id
  const findColumnByCardId = (CardId) => {
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(CardId))
  }

  const moveCardBetweenDifferenColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns (prevColumns => {
      // Tìm vị trí (index) của cái overCard trong column đích (nơi mà activeCard sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex (card => card._id === overCardId)

      // Logic tính toán "cardIndex mới" (trên hoặc dưới của overCard) lấy chuẩn ra từ code của thư viện nhiều khi muốn từ chối hiểu =))
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1:0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      // Clone OderredColumnState mang cu ra 1 mang moi de xu ly data roi return-update lai OderredColumnState moi
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      //nextActiveColumn: Column cu
      if (nextActiveColumn) {
        //Xoa card o column active
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId )
        // console.log(nextActiveColumn.cardOrderIds)

        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }
        //cap nhat lai mang cardOrderIds cho chuan du lieu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        // console.log(nextActiveColumn.cardOrderIds)
      }


      //nextOverColumn: column moi
      if (nextOverColumn) {
        //kiem tra card co o overColumn chua neu co thi xoa no truoc
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId )

        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: overColumn._id
        }

        //them card dang keo vao overColumn theo index vi tri moi
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
        //xoa FE_PlaceholderCard neu no dang ton tai
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)
        // cap nhat lai mang cardOrderIds moi cho chuan data
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        // console.log(nextOverColumn.cardOrderIds)
      }

      return nextColumns
    })
  }

  //trigger khi bắt đầu hành động kéo thả (drag) một phần tử => hành động thả (drop)
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active.id)
    setActiveDragItemType(event?.active.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN )
    setActiveDragItemData(event?.active.data.current)

    //Neu la keo card thi moi thu hien set gia tri oldcolumn
    if (event?.active.data?.current?.columnId) {
      setOldColumnWhenDraggingCard( findColumnByCardId(event?.active?.id) )
    }
  }

  //trigger trong quá trình kéo (drag) phần tử
  const handleDragOver = (event) => {
    const { active, over } = event
    // console.log(event)
    //không làm gì thêm nếu như đang kéo (drag) column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // dam bao khong ton tai active hoac over (khi keo ra khoi pham vi container) thi khong lam gi
    if (!active || !over) return

    //activeeDranggingCard: la card dang duoc keo
    const { id: activeDraggingCardId, data:{ current: activeDraggingCardData } } = active

    //overCard: la card dc tuong tac tren hoac duoi so voi card duoc keo o tren
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferenColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }


  //trigger khi kết thúc hành động kéo thả (drag) một phần tử => hành động thả (drop)
  const handleDragEnd = (event) => {
    // console.log('DragEnd :', event)
    // kiem tra keo tha
    const { active, over } = event

    if (!over|| !active) return

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log('hanh dong keo tha card')

      //activeeDranggingCard: la card dang duoc keo
      const { id: activeDraggingCardId, data:{ current: activeDraggingCardData } } = active
      //overCard: la card dc tuong tac tren hoac duoi so voi card duoc keo o tren
      const { id: overCardId } = over

      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
      // console.log(activeDragItemData)
      //neu khong ton tai 1 trong 2 column thi khong lam gi het
      if (!activeColumn ||!overColumn) return

      //hanh dong keo tha card giua 2 column khac nhau
      //phai dung toi activeDragItemData hoac oldColumnWhenDraggingCard._id chu khong phai activeData trong scope trong handleGragEnd vi sau khi
      //di qua onDragOver state cua card da bi cap nhat lai.
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        //
        moveCardBetweenDifferenColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        //hanh dong keo tha card trong 1 column

        //Lay vi tri phan tu cu tu oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        //lay vi tri phan tu moi tu overColumn
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)
        //dung arrymove de keo card (logic tuong tu keo columns)
        const dndOrderredCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        setOrderedColumns (prevColumns => {
          //clone mang orderedColumns cu ra mot mang moi de cap nhat lai data roi return
          const nextColums = cloneDeep(prevColumns)
          //tim toi column chung ta dang tha
          const targetColumn = nextColums.find(column => column._id === overColumn._id)
          //cap nhat lai 2 gia tri card va cardOrderIds cho targetColumn
          targetColumn.cards = dndOrderredCards
          targetColumn.cardOrderIds = dndOrderredCards.map(card => card._id)

          return nextColums
        })
      }
    }
    //xu ly keo tha column trong mot cai boardContent
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN ) {

      //neu sau khi vi tri keo tha khac voi vi tri ban dau
      if (over || active) {
        //lay vi tri cu tu thang active
        const oldColumIndex = orderedColumns.findIndex(c => c._id === active.id)

        //lay vi tri moi tu thang over
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

        //dung arrayMove cua thang dnd-kit de sap xep lai mang Columns ban dau
        const dndOrderedColums = arrayMove(orderedColumns, oldColumIndex, newColumnIndex)

        // const dndOrderedColumsIds = dndOrderedColums.map(c => c._id)
        moveColumns(dndOrderedColums)
        setOrderedColumns(dndOrderedColums)
      }
    }
    //nhung du lieu sau khi keo tha nay luon dua ve gia tri null mac dinh ban dau
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles:{ active:{ opacity: '0.5' } } })
  }
  //costum lai thuat toan phat hien va cham toi uu cho viec keo tha card
  //args = arguments = cac doi so/ tham so
  const collisionDetectionStrategy = useCallback((args) => {
    // truong hop keo columns thi dung thuat toan closestCorners la chuan nhat
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    //Tim cac diem giao nhau, va cham - intersections voi con tro
    const pointerIntersections = pointerWithin(args)
    if (!pointerIntersections?.length) return

    //Thuat toan phat hien va cham se tra ve mot mang cac va cham o day
    // const intersections = (!!pointerIntersections?.length) ? pointerIntersections : rectIntersection(args)

    // tim overId dau tien trong dam intersections o tren
    let overId = getFirstCollision(pointerIntersections, 'id')

    if (overId) {
      // neu over la column thi se tim toi cardid gan nhat ben trong khu vuc va cham dua vao thuat toan phat hien va cham closetCenter hoac closestCorners
      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => { return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
      }

      lastOverId.current = overId
      return [{ id : overId }]
    }
    // neu overId la null thi tra ve mang rong - tranh bi crash
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
    >

      <Box sx={{
        bgcolor:(theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => (theme.trello.boardContentHeight),
        p: '10px 0'
      }}>
        <ListColumns
          columns = { orderedColumns }
          createNewColumn = { createNewColumn }
          createNewCard = { createNewCard }
        />
        <DragOverlay dropAnimation={customDropAnimation} >
          { !activeDragItemId && null }
          {( activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}/> }
          {( activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData}/> }
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
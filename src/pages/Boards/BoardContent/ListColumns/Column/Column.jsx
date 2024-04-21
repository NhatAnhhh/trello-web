import { Box } from '@mui/system'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Fade from '@mui/material/Fade'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import MenuList from '@mui/material/MenuList'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import React, { useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import AddCardIcon from '@mui/icons-material/AddCard'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ListCards from './ListCards/ListCards'
import { mapOrder } from '~/utils/sorts'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TextField } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'


function Column({ column, createNewCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging }
  = useSortable({
    id: column._id,
    data: { ...column }
  })

  const dndKitColumnStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5: undefined
  }

  const orderedCard = mapOrder(column?.cards, column?.cardOrderIds, '_id')
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)
  const [newCardTitle, setNewCardTitle] = useState('')

  const addNewCardTitle = async () => {
    if (!newCardTitle) {
      toast.error('Please Enter Title Card!')
      return
    }

    //Tao data column de goi API
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }

    // * Gọi lên props function createNewCard nằm ở component cha cao nhất (boards/_id.jsx)
    // * và lúc này chúng ta có thể gọi luôn API ở đây là xong thay vì phải lần lượt gọi ngược lên những
    // component cha phía bên trên. (Đối với component con nằm càng sâu thì càng khổ :D)
    // *-
    // Với việc sử dụng Redux như vậy thì code sẽ Clean chuẩn chỉnh hơn rất nhiều.

    await createNewCard(newCardData)


    //Dong trang thai them card moi & clear input
    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
        {...listeners}
        sx={{
          ml:2,
          bgcolor:(theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          maxWidth: '300px',
          minWidth: '300px',
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc( ${theme.trello.boardContentHeight} - ${theme.spacing(5) })`
        }}>
        {/* box header */}
        <Box sx={{
          height : (theme) => theme.trello.columnHeaderHeight,
          display: 'flex',
          justifyContent: 'space-between',
          p: 2,
          alignItems: 'center'
        }}>
          <Typography sx={{ cursor: 'pointer', fontWeight:'bold' }}>{column?.title}</Typography>
          <Box>
            <Tooltip title = 'More options'>
              <ExpandMoreIcon
                sx={{ color: 'text.primary', cursor: 'pointer' }}
                id='basic-column-dropdown'
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              TransitionComponent={Fade}
            >
              <Paper sx={{ width: 'auto', maxWidth: '100%' }}>
                <MenuList>
                  <MenuItem>
                    <ListItemIcon>
                      <AddCardIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Add card</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <ContentCut fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Cut</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <ContentCopy fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copy</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <ContentPaste fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Paste</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem>
                    <ListItemIcon>
                      <DeleteForeverIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText> Remove this column </ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <Cloud fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Archive this column </ListItemText>
                  </MenuItem>
                </MenuList>
              </Paper>
            </Menu>
          </Box>
        </Box>
        {/* box content */}
        <ListCards cards = {orderedCard}/>

        {/* box footer */}
        <Box sx={{
          height: (theme) => theme.trello.columnFooterHeight,
          p:2
        }}>

          {!openNewCardForm
            ?
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
              <Button startIcon = {<AddCardIcon/>} onClick={toggleOpenNewCardForm}>Add new card </Button>
              <Tooltip title='Drag to move'>
                <DragHandleIcon sx={{ cursor:'pointer' }}/>
              </Tooltip>
            </Box>
            :
            <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <TextField
                id="filled-search"
                label="Enter card title..."
                variant='outlined'
                autoFocus
                data-no-dnd = 'true'
                type="text"
                size='small'
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': { color: (theme) => theme.palette.main,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643': 'white')
                  },
                  '& label .Mui-focused': { color: (theme) => theme.palette.main },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: (theme) => theme.palette.main },
                    '&:hover fieldset': { borderColor: (theme) => theme.palette.main },
                    '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.main }
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: 1
                  }
                }}
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  data-no-dnd = 'true'
                  onClick={addNewCardTitle}
                  variant='contained' color='success' size='small'
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                  }}
                >Add</Button>

                <CloseIcon fontSize='small'
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor :'pointer'
                  }}
                  onClick = {toggleOpenNewCardForm}
                />
              </Box>
            </Box>

          }
        </Box>
      </Box>
    </div>
  )
}

export default Column
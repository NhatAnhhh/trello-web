import { Box } from '@mui/system'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import { TextField } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'


function ListColumns({ columns, createNewColumn, createNewCard, deleteColumnDetails }) {

  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const addNewColumnTitle = async () => {
    if (!newColumnTitle) {
      toast.error('please enter title !')
      return
    }

    //Tao data column de goi API
    const newColumnData = {
      title: newColumnTitle
    }

    await createNewColumn(newColumnData)

    //Dong trang thai them card moi & clear input
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }


  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX:'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track':{ m: 2 }
      }}>
        {columns?.map(column =>
          <Column
            key={column._id}
            column = { column }
            createNewCard = { createNewCard }
            deleteColumnDetails = {deleteColumnDetails}
          />) }

        {/* button add new column */}
        {!openNewColumnForm
          ?
          <Box onClick = {toggleOpenNewColumnForm} sx={{
            maxWidth: '200px',
            minWidth: '200px',
            height: 'fit-content',
            mx: 2,
            borderRadius: '6px',
            bgcolor: '#FFFFFF3d'
          }}>
            <Button startIcon = {<NoteAddIcon/>}
              sx={{
                color: 'white',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}>
                Add new column
            </Button>
          </Box>
          :
          <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField
              id="filled-search"
              label="Enter column title..."
              variant='outlined'
              autoFocus
              type="text"
              size='small'
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label .Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor:'none' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }
              }}
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={addNewColumnTitle}
                variant='contained' color='success' size='small'
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                }}
              >Add column</Button>

              <CloseIcon fontSize='small'
                sx={{
                  color: 'white',
                  cursor :'pointer',
                  '&:hover': { color: (theme) => theme.palette.warning.light }
                }}
                onClick = {toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        }
      </Box>
    </SortableContext>
  )
}

export default ListColumns
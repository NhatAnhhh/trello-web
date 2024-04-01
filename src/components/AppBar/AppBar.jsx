import { Box } from '@mui/system'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import AppIcon from '@mui/icons-material/Apps'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Workspaces from './Menu/Workspaces'
import Recent from './Menu/Recent'
import Starred from './Menu/Starred'
import Templates from './Menu/Templates'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import HelpIcon from '@mui/icons-material/Help'
import Profiles from './Menu/profiles'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'

function AppBar() {
  const [searchValue, setSearchValue] = useState('')
  return (
    <>
      <Box px={2} sx={{
        // backgroundColor: 'primary.light',
        width : '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        bgcolor:(theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0')
      }}>

        <Box sx={{ display:'flex', alignItems: 'center', gap: 2 }}>
          <AppIcon sx={{ color: 'white' }}/>

          <Box sx={{ display:'flex', alignItems: 'center', gap: 0.5 }}>
            <SvgIcon component={TrelloIcon} inheritViewBox sx={{ color: 'white' }} />
            <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize:'1.5rem' }}>Trello</Typography>
          </Box>

          <Box sx={{ display:{ xs: 'none', md: 'flex' }, gap:1 } }>
            <Workspaces/>
            <Recent/>
            <Starred/>
            <Templates/>
            <Button
              sx={{ color: 'white', border: 'none', '&:hover':{ border:'none' } }}
              variant="outlined"
              startIcon={<LibraryAddIcon/>
              }>
                Create</Button>
          </Box>
        </Box>

        <Box sx={{ display:'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            id="filled-search"
            label="Search..."
            type="text"
            size='small'
            sx={{ minWidth: '120px', maxWidth: '170px',
              '& label': { color: 'white' },
              '& input': { color: 'white' },
              '& label .Mui-focused': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor:'none' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' }
              }
            }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={{
              startAdornment:(
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'white' }}/>
                </InputAdornment>
              ),
              endAdornment:(
                <CloseIcon fontSize='small' sx={{
                  color: searchValue ? 'white':'transparent',
                  cursor :'pointer'
                }}
                onClick = {() => setSearchValue('')}
                />
              )
            }}
          />
          <ModeSelect/>
          <Tooltip title='Notifications'>
            <Badge color="warning" variant="dot">
              <NotificationsIcon sx={{ color:'white', cursor:'pointer' }}/>
            </Badge>
          </Tooltip>

          <Tooltip title='Help'>
            <HelpIcon sx={{ color:'white', cursor: 'pointer' }}/>
          </Tooltip>
          <Profiles/>
        </Box>
      </Box>
    </>
  )
}

export default AppBar
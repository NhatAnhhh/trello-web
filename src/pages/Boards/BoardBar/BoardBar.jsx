import { Box } from '@mui/system'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import { capitalizeFirstLetter } from '~/utils/formatter'

const MENU_STYLE = {
  color:'white',
  bgcolor:'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root':{
    color:'white'
  },
  '&:hover':{
    bgcolor:'primary.50'
  }
}
function BoardBar({ board }) {
  return (
    <Box px ={2} sx={{
      width : '100%',
      height: (theme) => theme.trello.boarBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      bgcolor:(theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
    }}>
      <Box sx={{ display:'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLE}
          icon={<DashboardIcon/>}
          label = {board?.title}
          clickable
        />
        <Chip
          sx={MENU_STYLE}
          icon={<VpnLockIcon/>}
          label = { capitalizeFirstLetter(board?.type) }
          clickable
        />

        <Chip
          sx={MENU_STYLE}
          icon={<AddToDriveIcon/>}
          label = 'Add To Google Drive'
          clickable
        />

        <Chip
          sx={MENU_STYLE}
          icon={<BoltIcon/>}
          label = 'Automation'
          clickable
        />

        <Chip
          sx={MENU_STYLE}
          icon={<FilterListIcon/>}
          label = 'Filter'
          clickable
        />
      </Box>

      <Box sx={{ display:'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="outlined" startIcon={<PersonAddAlt1Icon/>}
          sx={{ color:'white',
            borderColor: 'white',
            '&:hover' : { borderColor: 'white' }
          }}>Invite</Button>
        <AvatarGroup sx={{
          '& .MuiAvatar-root' : {
            fontSize: 16,
            width: 34,
            height: 34
          }
        }} max={4}>
          <Tooltip title='Nhat Anh'>
            <Avatar alt="Remy Sharp" src="https://yt3.ggpht.com/yti/AGOGRCog5gmfCiZ-k0_qHq_S7PK8TFuJnsI7lF1Px22vVuE=s108-c-k-c0x00ffffff-no-rj" />
          </Tooltip>
          <Tooltip title='Nhat Anh'>
            <Avatar alt="Remy Sharp" src="https://yt3.ggpht.com/yti/AGOGRCog5gmfCiZ-k0_qHq_S7PK8TFuJnsI7lF1Px22vVuE=s108-c-k-c0x00ffffff-no-rj" />
          </Tooltip>
          <Tooltip title='Nhat Anh'>
            <Avatar alt="Remy Sharp" src="https://yt3.ggpht.com/yti/AGOGRCog5gmfCiZ-k0_qHq_S7PK8TFuJnsI7lF1Px22vVuE=s108-c-k-c0x00ffffff-no-rj" />
          </Tooltip>
          <Tooltip title='Nhat Anh'>
            <Avatar alt="Remy Sharp" src="https://yt3.ggpht.com/yti/AGOGRCog5gmfCiZ-k0_qHq_S7PK8TFuJnsI7lF1Px22vVuE=s108-c-k-c0x00ffffff-no-rj" />
          </Tooltip>
          <Tooltip title='Nhat Anh'>
            <Avatar alt="Remy Sharp" src="https://yt3.ggpht.com/yti/AGOGRCog5gmfCiZ-k0_qHq_S7PK8TFuJnsI7lF1Px22vVuE=s108-c-k-c0x00ffffff-no-rj" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
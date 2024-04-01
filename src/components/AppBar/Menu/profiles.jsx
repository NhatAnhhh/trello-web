import React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Fade from '@mui/material/Fade'
import { Box } from '@mui/system'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import MenuList from '@mui/material/MenuList'
import ListItemIcon from '@mui/material/ListItemIcon'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'

function Profiles() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <Tooltip title="Account settings" >
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar sx={{ width: 32, height: 32 }} src='https://yt3.ggpht.com/yti/AGOGRCog5gmfCiZ-k0_qHq_S7PK8TFuJnsI7lF1Px22vVuE=s108-c-k-c0x00ffffff-no-rj'></Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        id="basic-menu-profies"
        MenuListProps={{
          'aria-labelledby': 'basic-button-profies'
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <Paper sx={{ width: 'auto', maxWidth: '100%' }}>
          <MenuList>
            <MenuItem >
              <Avatar sx={{ width:'28px', height:'28px', mr:2 }} /> Profile
            </MenuItem>
            <MenuItem >
              <Avatar sx={{ width:28, height:28, mr:2 }}/> My account
            </MenuItem>
            <Divider />
            <MenuItem >
              <ListItemIcon>
                <PersonAdd fontSize="small" />
              </ListItemIcon>
              Add another account
            </MenuItem>
            <MenuItem >
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem >
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </MenuList>
        </Paper>
      </Menu>
    </Box>
  )
}
export default Profiles

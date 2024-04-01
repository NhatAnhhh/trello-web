// import { createTheme } from '@mui/material/styles'
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
// import { teal, deepOrange, brown, deepPurple } from '@mui/material/colors'

// Create a theme instance.
const APP_BAR_HEIGHT = '58px'
const BOAR_BAR_HEIGHT = '60px'
const BOAR_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOAR_BAR_HEIGHT})`
const COLUMN_HEADER_HEIGHT = '50px'
const COLUMN_FOOTER_HEIGHT = '56px'

const theme = extendTheme({

  trello:{
    appBarHeight : APP_BAR_HEIGHT,
    boarBarHeight: BOAR_BAR_HEIGHT,
    boardContentHeight: BOAR_CONTENT_HEIGHT,
    columnHeaderHeight: COLUMN_HEADER_HEIGHT,
    columnFooterHeight: COLUMN_FOOTER_HEIGHT
  },

  colorSchemes: {
    // light: {
    //   palette: {
    //     primary: teal,
    //     secondary: deepOrange
    //   }
    // },
    // dark: {
    //   palette: {
    //     primary: brown,
    //     secondary: deepPurple
    //   }
    // }
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '5px',
            height: '5px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#bdc3c7',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#00b894'
          }
        }
      }
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth: '0.5px'
        }
      }
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: ({
          // color: theme.palette.primary.main,
          // fontSize: '0.825rem',
          // '.MuiOutlinedInput-notchedOutline': {
          //   borderColor: theme.palette.primary.light
          // },
          // '&:hover': {
          //   '.MuiOutlinedInput-notchedOutline': {
          //     borderColor: theme.palette.primary.main
          //   }
          // },
          '& fieldset': {
            borderWidth: '0.5px !important'
          },
          '&:hover fieldset': {
            borderWidth: '1px !important'
          }
        })
      }
    },

    MuiInputLable: {
      styleOverrides: {
        root:({ fontSize: '0.875rem' })
      }
    },

    MuiTypography: {
      styleOverrides: {
        root:{
          '&.MuiTypography-body1':{ fontSize: '0.875rem' }
        }
      }
    }
  }
}
)

export default theme
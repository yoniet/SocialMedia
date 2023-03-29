import { createTheme } from '@mui/material'
import { pink } from '@mui/material/colors'


const theme = createTheme({
    typography: {
        myVariant: {
            color: pink[400],
            fontSize: '5rem'
        }
    },
    palette: {
        primary: {
            light: '#5c67a3',
            main: '#F25AA6',
            dark: '#2e355b',
            contrastText: '#fff',
        },
        secondary: {
            main: '#ff4081',
            light: '#ff79b0',
            dark: '#c60055',
            contrastText: '#000',
        },
        openTitle: '#3f4771',
        protectedTitle: pink[400],
        type: 'light'
    }
})

export default theme;
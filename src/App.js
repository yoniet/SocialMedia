import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import MainRouter from './MainRouter';
import theme from './theme'
import { ThemeProvider } from '@mui/material'
import Newsfeed from './components/post/Newsfeed';
import Post from './components/post/Post';



const App = () => {
    return (

        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <MainRouter />
                {/* <Post/> */}
            </BrowserRouter>
        </ThemeProvider>

    )
}



export default App;
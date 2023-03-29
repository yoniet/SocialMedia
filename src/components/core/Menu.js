import React from 'react';
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import HouseIcon from '@mui/icons-material/House'
import Button from '@mui/material/Button'
import { Box } from '@mui/material'
import { Link } from 'react-router-dom'
import { auth } from '../auth/auth-helper';
import { useNavigate } from 'react-router-dom';


const isActive = (history, path) => {
    if (history === path) {
        return { color: 'red' }
    } else {
        return { color: 'blue' }
    }
}

const Menu = ({history}) => {
    let navigate = useNavigate();
    
  return  (

        <AppBar position="sticky" sx={{margin: 'auto', width: 'auto'}}>
            <Toolbar>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <IconButton sx={{ flexGrow: 2, justifyContent: 'flex-start' }} style={isActive(history, "/")} >
                        <HouseIcon />
                    </IconButton>
                </Link>
                <Typography sx={{ flexGrow: 2 }} variant="h6" color="inherit">
                    Social Media
                </Typography>
                <Box sx={{ justifyContent: 'flex-end' }}>
                    <Link to="/users" style={{ textDecoration: 'none' }}>
                        <Button  color="inherit">Users</Button>
                    </Link>
                    {
                        !auth.isAuthenticated() && (
                            <span>
                                <Link to="/signup" style={{ textDecoration: 'none' }}>
                                    <Button color="inherit" >Sign up</Button>
                                </Link>
                                <Link to="/signin" style={{ textDecoration: 'none' }}>
                                    <Button color="inherit">Sign in</Button>
                                </Link>
                            </span>
                        )
                    }
                    {
                        auth.isAuthenticated() && (
                            <span>
                                <Link to={"/user/" + auth.isAuthenticated().user._id} style={{ textDecoration: 'none' }}>
                                    <Button style={isActive(history, "/user/" + auth.isAuthenticated().user._id)}>My Profile</Button>
                                </Link>
                                <Button color="inherit" onClick={() => {
                                    auth.clearJWT(() => navigate('/'))
                                }}>
                                    Sign Out
                                </Button>
                            </span>
                        )
                    }

                </Box>
            </Toolbar>
        </AppBar>
    )

}

export default Menu;
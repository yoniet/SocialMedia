
import React, { useState, useEffect } from 'react';
import { list } from './api-user'
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Paper, Typography } from '@mui/material';
import { ArrowForward, Person } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import theme from '../../theme';



const sxStyle = {
    root: {
        padding: theme.spacing(1),
        margin: theme.spacing(5)
    },
    // title: {
    //     textAlign: 'center',
    //     fontSize: '2rem',
    //     margin: '8px 0 4px',
    //     color: '#F050F9'
    // }
    title: {
        margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    }
}




const Users = () => {
    const [users, setUsers] = useState([]);


    useEffect(() => {

        const abortController = new AbortController()
        const signal = abortController.signal;

        list(signal)
            .then((data) => {
                if (data && data.error) {
                    console.log(data.error)
                } else {
                    setUsers(data)
                }
            })

        return function cleanup() {
            abortController.abort()
        }

    }, [])



    return (
        <Paper sx={sxStyle.root}>
            <Typography sx={sxStyle.title}>All Users</Typography>
            <List>
                {
                    users.map((item, i) => (
                        <Link to={"/user/" + item._id} key={i} style={{ textDecoration: 'none' }}>
                            <ListItem button>
                                <ListItemAvatar>
                                    <Avatar src={'/api/users/photo/' + item._id} />
                                </ListItemAvatar>
                                <ListItemText sx={sxStyle.title}>{item.name}</ListItemText>
                                <ListItemSecondaryAction>
                                    <IconButton>
                                        <ArrowForward />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </Link>
                    ))
                }
            </List>
        </Paper>

    )

}

export default Users;
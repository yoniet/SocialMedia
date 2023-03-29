import { Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Paper, Snackbar, Typography } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../auth/auth-helper'
import { findPeople, follow } from './api-user'
import theme from '../../theme';


const sxStyle = {
    root: {
        padding: theme.spacing(1),
        margin: 0
    },
    title: {
        margin: `${theme.spacing(3)}px ${theme.spacing(1)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle,
        fontSize: '1em' 
    },
    avatar: {
        marginRight: theme.spacing(1)
    },
    follow: {
        right: theme.spacing(2)
    },
    snack: {
        color: theme.palette.protectedTitle
    },
    viewButton: {
        verticalAlign: 'middle'
    }
}

const FindPeople = () => {
    const [values, setValues] = useState({
        users: [],
        open: false,
        followMessage: ''
    })

    const jwt = auth.isAuthenticated()

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        findPeople({
            userId: jwt.user._id
        }, {
            t: jwt.token
        }, signal).then((data) => {
            if (data && data.error) {
                console.log(data.error)
            } else {
                setValues({ ...values, users: data })
            }
        })

        // TODO: check another function cleanup
        return function cleanup() {
            abortController.abort()
        }
    }, [])

    const clickFollow = (user, index) => {
        follow({
            userId: jwt.user._id
        }, {
            t: jwt.token
        }, user._id).then((data)=> {
            if (data.error) {
                console.log(data.error)
            } else {
                let toFollow = values.users
                toFollow.splice(index, 1)
                setValues({...values, users: toFollow, open: true, followMessage: `Following ${user.name}!`})
            }
        })
    }

    // TODO: finish this function
    const handleRequestClose = (event, reason) => {
        setValues({...values, open: false })
      }

    return (
        <div>
            <Paper sx={sxStyle.root} elevation={4}>
                <Typography type="title" sx={sxStyle.title}>
                    Who to follow
                </Typography>
                <List>
                    {values.users ?
                        values.users.map((item, i) => {
                            return <span key={i}>
                                <ListItem>
                                    <ListItemAvatar sx={sxStyle.avatar}>
                                        <Avatar src={'/api/users/photo/' + item._id} />
                                    </ListItemAvatar>
                                    <ListItemText primary={item.name} />
                                    <ListItemSecondaryAction sx={sxStyle.follow}>
                                        <Link to={"/user/" + item._id}>
                                            <IconButton variant="contained" sx={sxStyle.viewButton}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Link>
                                        <Button aria-label='Follow' variant='contained' onClick={() => { clickFollow(item, i) }}>
                                            Follow
                                        </Button>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </span>
                        })
                        : undefined
                    }
                </List>
            </Paper>
            <Snackbar 
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                open={values.open}
                onClose={handleRequestClose}
                autoHideDuration={3000}
                message={<span style={sxStyle.snack}>{values.followMessage}</span>}
            />
        </div>
    )
}

export default FindPeople
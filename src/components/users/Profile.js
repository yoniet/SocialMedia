import { Edit, Person } from '@mui/icons-material';
import { Avatar, Button, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { read } from './api-user'
import { auth } from '../auth/auth-helper'
import { Navigate, Link, useParams } from 'react-router-dom'
import DeleteUser from './DeleteUser'
import FollowProfileButton from './FollowProfileButton'
import FollowGrid from './FollowGrid'
import ProfileTabs from './ProfileTabs';
import { listByUser } from '../post/api-post';
import theme from '../../theme';


const sxStyle = {
    root: {
        maxWidth: 600,
        margin: 'auto',
        padding: theme.spacing(2),
        marginTop: theme.spacing(2)
    },
    title: {
        margin: `${theme.spacing(2)}px ${theme.spacing(1)}px 0`,
        color: theme.palette.protectedTitle,
        fontSize: '1em'
    },
    bigAvatar: {
        width: 50,
        height: 50,
        // margin: 'auto'
    },
    buttonFollow: {
        marginRight: 60
    }
}

const Profile = () => {
    const { userId } = useParams()

    const [values, setValues] = useState({
        user: { following: [], followers: [] },
        following: false
    })

    const [posts, setPosts] = useState([])

    // console.log(values)
    const [redirectToSignIn, setRedirectToSignIn] = useState(false);
    const jwt = auth.isAuthenticated()


    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;


        read({
            userId: userId
        }, { t: jwt.token }, signal)
            .then((data) => {
                if (data && data.error) {
                    setRedirectToSignIn(true)
                } else {
                    let following = checkFollow(data)
                    setValues({ ...values, user: data, following: following })
                    loadPosts(data._id)
                }
            })


        return function cleanup() {
            abortController.abort()
        }
    }, [userId])

    // To determine the value to set in "following"
    // This method will check if the signed-in in user exists in the fetched user's "followers" list
    const checkFollow = (user) => {
        // Check if the object is not empty in order to avoid an undefined error
        if (Object.keys(user).length != 0) {
            // Go through the list to check the followers
            const match = user.followers.some((follower) => {
                // jwt.user._id = user connected 
                // follower._id = profile another user
                // return match if found
                return follower._id === jwt.user._id
            })
            return match
        }
    }

    const clickFollowButton = (callApi) => {
        callApi({
            userId: jwt.user._id
        }, {
            t: jwt.token
        }, values.user._id).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({ ...values, user: data, following: !values.following })
            }
        })
    }

    // This fetch method will load the required posts for PostList,
    // which is added to the "Profile view".
    const loadPosts = (user) => {
        listByUser({
            userId: user
        }, {
            t: jwt.token
        }).then((data) => {
            if (data.error) {
                console.log(data.error)
            } else {
                setPosts(data)
            }
        })
    }

    // To ensure the 'img' element reloads in the 'Profile' view after the photo is update,
    // we have to add a time value to the photo URL to bypass the "browser's default image caching behavior".
    const photoUrl = values.user._id
        ? `/api/users/photo/${values.user._id}?${new Date().getTime()}`
        : '/api/users/defaultPhoto'

    if (redirectToSignIn) {
        return <Navigate to='/signin' />
    }



    return (
        <Paper sx={sxStyle.root} elevation={4}>
            <Typography variant='h6' sx={sxStyle.title}>
                Profile
            </Typography>
            <List dense>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar src={photoUrl} sx={sxStyle.bigAvatar} />
                        {/* <Person /> */}
                    </ListItemAvatar>
                    <ListItemText primary={values.user.name} secondary={values.user.email} />
                    {
                        auth.isAuthenticated().user && auth.isAuthenticated().user._id === values.user._id
                            ? (<ListItemSecondaryAction>
                                <Link to={"/user/edit/" + values.user._id} >
                                    <IconButton aria-label='Edit' >
                                        <Edit />
                                    </IconButton>
                                </Link>
                                <DeleteUser userId={values.user._id} />
                            </ListItemSecondaryAction>
                            )
                            : (<FollowProfileButton sx={sxStyle.buttonFollow} following={values.following} onButtonClick={clickFollowButton} />)
                    }
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText secondary={values.user.about} >About</ListItemText>
                </ListItem>

                <Divider />
                <ListItem>
                    <ListItemText primary={"Joined: " + (
                        new Date(values.user.created)).toDateString()} />
                </ListItem>
            </List>
            <ProfileTabs user={values.user} posts={posts} />
        </Paper>
    )
}

export default Profile;
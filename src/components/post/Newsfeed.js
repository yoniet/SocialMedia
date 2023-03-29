import { Card, Divider, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { listNewsFeed } from './api-post'
import { auth } from '../auth/auth-helper'
import PostList from './PostList'
import NewPost from './NewPost'
import theme from '../../theme'


const sxStyle = {
    card: {
        margin: 'auto',
        paddingTop: 1,
        paddingLeft: 3,
        paddingRight: 3,
        paddingBottom: theme.spacing(2)
    },
    title: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle,
        fontSize: '1em'
    },
    media: {
        minHeight: 330
    }
}


/**
 * Here specifically, we initially make a call to the server
 * to fetch a list of posts from people that currently signed-in user follows.
 * Then we set this list of posts to the state to be rendered in the "PostList" component.
 */
const Newsfeed = () => {
    const [posts, setPosts] = useState([])
    const jwt = auth.isAuthenticated()

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal

        listNewsFeed({
            userId: jwt.user._id
        }, {
            t: jwt.token
        }, signal).then((data) => {
            if (data.error) {
                console.log(data.error)
            } else {
                setPosts(data)
            }
        })
        return function cleanup() {
            abortController.abort()
        }
    }, [])

    // 'addPost' & 'removePost' functions provided for "NewPost" & "PostList" components
    // 'addPost' function will take the new post that was created
    // in the "NewPost" Component and add it to the posts in the state.
    const addPost = (post) => {
        const updatedPosts = [...posts]
        // The unshift() method adds new elements to the beginning of an array.
        updatedPosts.unshift(post)
        setPosts(updatedPosts)
    }

    // 'removePost' function will take the deleted post from the "Post" component in "PostList"
    // and remove it from the posts in the state.
    const removePost = (post) => {
        const updatedPosts = [...posts]
        const index = updatedPosts.indexOf(post)
        // At position index, remove 1 item:
        updatedPosts.splice(index, 1)
        setPosts(updatedPosts)
    }

    return (

            <Card sx={sxStyle.card}>
                <Typography type="title" sx={sxStyle.title}>
                    Newsfeed
                </Typography>
                <Divider />
                <NewPost addUpdate={addPost} />
                <Divider />
                <PostList removeUpdate={removePost} posts={posts} />
            </Card>

    )
}

export default Newsfeed
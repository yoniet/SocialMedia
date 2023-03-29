import { Comment, Favorite, FavoriteBorder } from '@mui/icons-material'
import { CardActions, IconButton } from '@mui/material'
import CommentIcon from '@mui/icons-material/Comment';
import React, { useState } from 'react'
import { auth } from '../auth/auth-helper';
import {like, unlike} from './api-post'


const sxStyle = {

}

const ActionPost = (props) => {
    const [values, setValues] = useState({
        like: checkLike(props.post.likes),
        likes: props.post.likes.length,
        comments: props.post.comments
    })
    const jwt = auth.isAuthenticated()

    // This method checks whether the currently signed-in user 
    // is referenced in the post's likes array or not.
    const checkLike = (likes) => {
        let match = likes.indexOf(jwt.user._id) !== -1
        return match
    }

    // this method that will call the appropriate fetch method based 
    // on whether it is a 'like' or 'unlike'
    const clickLike = () => {
        // Which of the 'like' or 'unlike' API endpoints will be called on a click
        // depends on the value of the "like" variable in the state(values.like).
        let callApi = values.like ? unlike : like
        callApi({
            userId: jwt.user._id
        }, {
            t: jwt.token
        }, props.post._id).then((data)=> {
            if (data.error) {
                console.log(data.error)
            } else {
                setValues({...values, like: !values.like, likes: data.likes.length})
            }
        })
    }

    return (
        <CardActions>
            {
                values.like 
                ? <IconButton onClick={clickLike} sx={sxStyle} aria-label="Like" color="secondary">
                    <Favorite />
                </IconButton>
                : <IconButton onClick={clickLike} sx={sxStyle} aria-label="Unlike" color='secondary'>
                    <FavoriteBorder />
                </IconButton>
            }
            <span>{values.likes}</span>
            <IconButton sx={sxStyle} aria-label="Comment" color="secondary">
                <CommentIcon />
            </IconButton>
            <span>{values.comments.length}</span>
        </CardActions>
    )
}

export default ActionPost
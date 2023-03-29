import React, { useState } from 'react';
import { auth } from '../auth/auth-helper'
import { Avatar, Card, CardActions, CardContent, CardHeader, Divider, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import theme from '../../theme';
import ContentPost from './ContentPost';
import ActionPost from './ActionPost';
import Comments from './Comments';
import { remove } from './api-post'
import { FavoriteBorder, FavoriteOutlined } from '@mui/icons-material';
import CommentIcon from '@mui/icons-material/Comment';
import { like, unlike } from './api-post'





const sxStyle = {
    card: {
        maxWidth: 800,
        margin: 'auto',
        marginBottom: theme.spacing(3),
        backgroundColor: 'rgb(0, 0, 0, 0.06)'
    },
    cardContent: {
        backgroundColor: 'white',
        padding: `${theme.spacing(2)}px 0px`
    },
    cardHeader: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    text: {
        margin: theme.spacing(2)
    },
    photo: {
        textAlign: 'center',
        backgroundColor: '#f2f5f4',
        padding: theme.spacing(1)
    },
    button: {
        margin: theme.spacing(1)
    },
    media: {
      height: 200,
    //   width: 300
    }
}

const Post = (props) => {

    const jwt = auth.isAuthenticated()

    const checkLike = (likes) => {
        let match = likes.indexOf(jwt.user._id) !== -1
        return match
    }

    const [values, setValues] = useState({
        like: checkLike(props.post.likes),
        likes: props.post.likes.length,
        comments: props.post.comments
    })

    const clickLike = () => {
        let callApi = values.like ? unlike : like
        callApi({
            userId: jwt.user._id
        }, {
            t: jwt.token
        }, props.post._id).then((data) => {
            if (data.error) {
                console.log(data.error)
            } else {
                setValues({ ...values, like: !values.like, likes: data.likes.length })
            }
        })
    }

    const deletePost = () => {
        remove({
            postId: props.post._id
        }, {
            t: jwt.token
        }).then((data) => {
            if (data.error) {
                console.log(data.error)
            } else {
                // this method is sent as a prop from either "Newsfeed" or "Profile"
                // to update the list pf posts in the state when the delete is successful.
                props.onRemove(props.post)
            }
        })
    }



    const updateComments = (comments) => {
        setValues({ ...values, comments: comments })
    }

    return (<Card sx={sxStyle.card}> 
        <CardHeader sx={sxStyle.cardHeader}
            avatar={
                <Avatar src={'/api/users/photo/' + props.post.postedBy._id} />
            }
            action={
                // this conditionally show a delete button if the signed-in user viewing their own post
                props.post.postedBy._id ===
                auth.isAuthenticated().user._id &&
                <IconButton onClick={deletePost}>
                    <DeleteIcon />
                </IconButton>
            }
            title={<Link to={'/user/' + props.post.postedBy._id} style={{textDecoration: 'none'}}>{props.post.postedBy.name}</Link>}
            subheader={(new Date(props.post.created)).toDateString()}
        />
        <CardContent  sx={sxStyle.cardContent}>
            <Typography component="p" sx={sxStyle.text}>
                {props.post.text}
            </Typography>
            {props.post.photo &&
                (<div style={sxStyle.photo}>
                    <img style={sxStyle.media}
                        height="300px" width="300px"
                        src={'/api/posts/photo/' + props.post._id}
                    />
                </div>)}
        </CardContent>
        {/* <ContentPost text={props.post.text} photo={props.post.photo} id={props.post._id} /> */}
        <CardActions>
            {
                values.like
                    ? <IconButton onClick={clickLike} sx={sxStyle.button} aria-label="Like" color="secondary">
                        <FavoriteOutlined />
                    </IconButton>
                    : <IconButton onClick={clickLike} sx={sxStyle.button} aria-label="Unlike" color='secondary'>
                        <FavoriteBorder />
                    </IconButton>
            }
            <span>{values.likes}</span>
            <IconButton sx={sxStyle.button} aria-label="Comment" color="secondary">
                <CommentIcon />
            </IconButton>
            <span>{values.comments.length}</span>
        </CardActions>
        {/* <ActionPost data={props} /> */}
        <Divider />
        <Comments postId={props.post._id}
            comments={values.comments}
            updateComments={updateComments}
        />
    </Card>
    )
}

export default Post
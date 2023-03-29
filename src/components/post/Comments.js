import React, { useState } from 'react';
import { Avatar, CardHeader, Icon, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { auth } from '../auth/auth-helper';
import { comment, uncomment } from './api-post'
import DeleteIcon from '@mui/icons-material/Delete';
import theme from '../../theme';

const sxStyle = {
    cardHeader: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(1)
    },
    smallAvatar: {
        width: 25,
        height: 25
    },
    commentFiled: {
        width: '96%'
    },
    commentText: {
        backgroundColor: 'white',
        padding: theme.spacing(1),
        margin: `4px ${theme.spacing(4)}px 4px 4px`
    },
    commentDate: {
        display: 'block',
        color: 'gray',
        fontSize: '0.8em'
    },
    commentDelete: {
        fontSize: '1.6em',
        verticalAlign: 'middle',
        cursor: 'pointer'
    }
}

const Comments = (props) => {


    const jwt = auth.isAuthenticated()
    const [text, setText] = useState('')

    const addComment = (event) => {
        // The text will be stored in database when the user press Enter key.
        // the 'keyCode' of Enter is 13 
        if (event.keyCode == 13 && event.target.value) {
            event.preventDefault()
            comment({
                userId: jwt.user._id
            }, {
                t: jwt.token
            }, props.postId, { text: text }).then((data) => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    setText('')
                    props.updateComments(data.comments)
                }
            })
        }
    }

    const handleChange = event => {
        setText(event.target.value)
    }

    const deleteComment = comment => event => {
        uncomment({
            userId: jwt.user._id
        }, {
            t: jwt.token
        }, props.postId, comment).then((data) => {
            if (data.error) {
                console.log(data.error)
            } else {
                props.updateComments(data.comments)
            }
        })
    }

    // this renders the content, including the name of the commenter linked to their profile,
    // the comment text, and the date of comment creation
    const commentBody = item => {
        return (
            <p style={sxStyle.commentText} >
                <Link to={"/user/" + item.postedBy._id} style={{textDecoration: 'none'}}>{item.postedBy.name}</Link><br />
                {item.text}
                <span style={sxStyle.commentDate} >
                    {(new Date(item.created)).toDateString()} |
                    {/* 
                        it will also render a delete option for the comment if the 'postedBy'
                        reference of the comment matches the currently signed-in user
                     */}
                    {auth.isAuthenticated().user._id === item.postedBy._id &&
                        <DeleteIcon style={sxStyle.commentDelete} onClick={deleteComment(item)} >delete</DeleteIcon>
                    }
                </span>
            </p>
        )
    }

    return (<div>

        <CardHeader sx={sxStyle.cardHeader}
            avatar={
                <Avatar sx={sxStyle.smallAvatar} src={'/api/users/photo/' + auth.isAuthenticated().user._id} />
            }
            title={<TextField
                sx={sxStyle.commentFiled}
                onKeyDown={addComment}
                multiline
                value={text}
                onChange={handleChange}
                placeholder="Write something ..."
                margin="normal"
            />}
        />
        {
            // It iterates over the individual comments to render the details of the commenter
            // and the comment content
            props.comments && props.comments.map((item, i) => {
                return (
                    <CardHeader sx={sxStyle.cardHeader}
                        avatar={
                            <Avatar sx={sxStyle.smallAvatar} src={'/api/users/photo/' + item.postedBy._id} />
                        }
                        title={commentBody(item)} 
                        key={i}
                    />
                )
            })
        }
    </div>
    )
}

export default Comments
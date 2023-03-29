import { PhotoCamera } from '@mui/icons-material';
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Icon, IconButton, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import theme from '../../theme';
import { auth } from '../auth/auth-helper';
import { create } from './api-post'

const sxStyle = {
    root: {
        backgroundColor: '#efefef',
        padding: `${theme.spacing(3)}px 0px 1px`,
        borderRadius: 5
    },
    card: {
        maxWidth: 'auto',
        margin: 'auto',
        marginBottom: theme.spacing(3),
        backgroundColor: 'rgba(65, 150, 136, 0.09)',
        boxShadow: 'none',

    },
    cardContent: {
        backgroundColor: 'white',
        paddingTop: 0,
        paddingBottom: 0
    },
    cardHeader: {
        paddingTop: 2,
        paddingBottom: 2
    },
    photoButton: {
        height: 30,
        marginBottom: 5
    },
    input: {
        display: 'none',
    },
    textField: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        width: '90%'
    },
    submit: {
        margin: theme.spacing(2)
    },
    filename: {
        verticalAlign: 'super'
    }
}

const NewPost = (props) => {
    const [values, setValues] = useState({
        text: '',
        photo: '',
        error: '',
        user: {}
    })
    const jwt = auth.isAuthenticated()

    useEffect(()=> {
        setValues({...values, user: auth.isAuthenticated().user})
    })

    const clickPost = () => {
        let postData = new FormData()
        postData.append('text', values.text)
        postData.append('photo', values.photo)

        create({
            userId: jwt.user._id
        }, {
            t: jwt.token
        }, postData).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({ ...values, text: '', photo: '' })
                props.addUpdate(data)
            }
        })
    }

    const handleChange = name => event => {
        const value = name === 'photo'
            ? event.target.files[0]
            : event.target.value
        setValues({ ...values, [name]: value })
    }

    // values.user._id ? '/api/users/photo/' + values.user._id :
    const photoURL = values.user._id ? '/api/users/photo/' + values.user._id : '/api/users/defaultPhoto'

    return (
        <div style={sxStyle.root}>
            <Card sx={sxStyle.card}>
                <CardHeader
                    avatar={
                        <Avatar src={photoURL} />
                    }
                    title={values.user.name}
                    sx={sxStyle.cardHeader}
                />
                <CardContent sx={sxStyle.cardContent}>
                    <TextField
                        placeholder="Share your thoughts ..."
                        multiline
                        rows="3"
                        value={values.text}
                        onChange={handleChange('text')}
                        sx={sxStyle.textField}
                        margin="normal"
                    />
                    <input accept='image/*' type='file' id="icon-button-file" style={sxStyle.input}  onChange={handleChange('photo')}/>
                    <label htmlFor='icon-button-file'>
                        <IconButton color="secondary" sx={sxStyle.photoButton} component="span" >
                            <PhotoCamera />
                        </IconButton>
                    </label>
                    <span style={sxStyle.filename}>{values.photo ? values.photo.name : ''}</span>
                    {
                        values.error && (
                            <Typography component="p" color="error">
                                <Icon color='error' sx={sxStyle}>error</Icon>
                                {values.error}
                            </Typography>
                        )
                    }
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained" disabled={values.text === ''} onClick={clickPost} sx={sxStyle.submit}>POST</Button>
                </CardActions>
            </Card>
        </div>
    )
}

export default NewPost
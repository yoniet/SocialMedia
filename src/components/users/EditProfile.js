import { Avatar, Box, Button, Card, CardActions, CardContent, Divider, Icon, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { auth } from '../auth/auth-helper'
import { read, update } from './api-user';
import { Navigate, useParams } from 'react-router-dom'
import { FileUpload } from '@mui/icons-material';
import theme from '../../theme';


const sxStyle = {
    card: {
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
        marginTop: theme.spacing(4),
        paddingBottom: theme.spacing(2)
    },
    title: {
        margin: theme.spacing(2),
        color: theme.palette.protectedTitle
    },
    error: {
        verticalAlign: 'middle'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300
    },
    submit: {
        margin: 'auto',
        marginBottom: theme.spacing(2)
    },
    bigAvatar: {
        width: 60,
        height: 60,
        margin: 'auto'
    },
    input: {
        display: 'none'
    },
    filename: {
        marginLeft: '10px'
    }
}

const EditProfile = () => {
    let { userId } = useParams()

    const [userID, setUserID] = useState(userId)

    const [values, setValues] = useState({
        name: '',
        email: '',
        photo: '',
        about: '',
        password: '',
        open: false,
        error: '',
        redirectToProfile: false,
        id: ''
    });

    const jwt = auth.isAuthenticated();


    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        read({
            userId: userID
        }, { t: jwt.token }, signal).then((data) => {
            if (data && data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({ ...values, id: data._id, name: data.name, email: data.email, about: data.about })
            }
        })

        return function cleanup() {
            abortController.abort()
        }
    }, [userID])





    const clickSubmit = (e) => {
        e.preventDefault()
        let userData = new FormData();
        values.name && userData.append('name', values.name)
        values.email && userData.append('email', values.email)
        values.password && userData.append('password', values.password)
        values.about && userData.append('about', values.about)
        values.photo && userData.append('photo', values.photo)


        update({
            userId: userID
        }, {
            t: jwt.token
        }, userData).then((data) => {
            if (data && data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setUserID(values.userId)
                setValues({ ...values, redirectToProfile: true })
            }
        })
    };

    const handleChange = name => event => {
        const value = name === 'photo'
            ? event.target.files[0]
            : event.target.value
        setValues({ ...values, [name]: value })
    }

    const photoUrl = values.id
        ? `/api/users/photo/${values.id}?${new Date().getTime()}`
        : '/api/users/defaultphoto'
    if (values.redirectToProfile) {
        return (<Navigate to={'/'} />)
    }


    return (
        <Card sx={sxStyle.card}>
            <CardContent>
                <Typography variant="h6" sx={sxStyle.title}>
                    Edit Profile
                </Typography>
                <Avatar src={photoUrl} sx={sxStyle.bigAvatar} />
                <br/>
                <input accept='image/*' type="file" onChange={handleChange('photo')} style={sxStyle.input} id="icon-button-file" />
                <label htmlFor='icon-button-file' >
                    <Button variant='contained' component="span" >
                        Upload
                        <FileUpload />
                    </Button>
                </label>
                <span style={sxStyle.filename}>{values.photo ? values.photo.name : ''}</span><br/>
                <TextField sx={sxStyle.textField} id="name" label="Name" value={values.name || ''} onChange={handleChange('name')} />
                <TextField sx={sxStyle.textField} id='multiline-flexible' label='About' multiline value={values.about || ''} onChange={handleChange('about')} />
                <TextField sx={sxStyle.textField} id="email" label="Email" value={values.email || ''} onChange={handleChange('email')} />
                <TextField sx={sxStyle.textField} id="password" label="Password" value={values.password || ''} onChange={handleChange('password')} />
                {
                    values.error && (
                        <Typography component="p" color="error">
                            <Icon color='error' sx={sxStyle.error}>error</Icon>
                            {values.error}
                        </Typography>
                    )
                }
            </CardContent>
            <CardActions>
                <Button sx={sxStyle.submit} variant='contained' onClick={clickSubmit} >Submit</Button>
            </CardActions>
        </Card>
    )
}

export default EditProfile;
import React, { useState } from "react";
import { Button, Card, CardActions, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { create } from "./api-user";
import { Link } from 'react-router-dom'
import theme from "../../theme";

const sxStyle = {
    card: {
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
        marginTop: theme.spacing(5),
        paddingBottom: theme.spacing(2)
      },
      error: {
        verticalAlign: 'middle'
      },
      title: {
        marginTop: theme.spacing(2),
        color: theme.palette.openTitle
      },
      textField: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 300
      },
      submit: {
        margin: 'auto',
        marginBottom: theme.spacing(2)
      }
}

const SignUp = () => {

    const [userDetail, setUserDetail] = useState({
        name: '',
        password: '',
        email: '',
        open: false,
        error: '',
    })

    const handleChange = name => event => {
        setUserDetail({ ...userDetail, [name]: event.target.value })
    }

    const clickSubmit = () => {
        const newUser = {
            name: userDetail.name,
            email: userDetail.email,
            password: userDetail.password
        }
        // call function create from api-user
        create(newUser)
            .then((data) => {
                // to check response from server
                if (data.error) {
                    setUserDetail({ ...userDetail, error: data.error })
                } else {
                    setUserDetail({ ...userDetail, error: '', open: true })
                }
            })
    }

    return (
        <Container>
            <Card sx={sxStyle.card}>
                <CardContent>
                    <Typography sx={sxStyle.title}> 
                        Sign Up
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <TextField sx={sxStyle.textField} type="text" id="name" label="Name" value={userDetail.name} onChange={handleChange('name')} />
                        <TextField sx={sxStyle.textField} type="email" id="email" label="Email" value={userDetail.email} onChange={handleChange('email')} />
                        <TextField sx={sxStyle.textField} type="password" id="password" label="Password" value={userDetail.password} onChange={handleChange('password')} />
                    </Box>
                </CardContent>
                <CardActions >
                    <Button variant="contained" sx={sxStyle.submit} onClick={clickSubmit}>Submit</Button>
                </CardActions>
            </Card>
            <Dialog open={userDetail.open}>
                <DialogTitle>New Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        New Account successfully created.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Link to="/signin" style={{ textDecoration: 'none' }}>
                        <Button autoFocus="autoFocus" variant="contained">Sign In</Button>
                    </Link>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default SignUp;
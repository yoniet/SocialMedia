import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import FindPeople from '../users/FindPeople';
import { auth } from '../auth/auth-helper';
import { useLocation } from 'react-router';
import { upperCase } from '../../functionsHelper/upperCase';
import theme from '../../theme';
import { Avatar, CardMedia, Grid } from '@mui/material';
import imageHomePage from '../../../public/images/profile-pic.png'
import imageBackGround from '../../../public/images/pexels-pixabay.jpg'
import Newsfeed from '../post/Newsfeed';


const sxStyle = {
    root: {
        flexGrow: 1,
        margin: 30,
    },
    card: {
        maxWidth: 600,
        margin: 'auto',
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5)
    },
    title: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.text.secondary
    },
    media: {
        minHeight: 200,
        width: 'auto',
        height: 'auto',
    },
    credit: {
        padding: 0.5,
        textAlign: 'left',
        backgroundColor: '#ededed',
        borderBottom: '1px solid #d0d0d0',
        '& a': {
            color: '#3f4771'
        }
    },
    bigAvatar: {
        // margin: 'auto',
        width: 130,
        height: 130,
        top: 20,
        left: 20

    }
}

const Home = () => {

    const [defaultPage, setDefaultPage] = useState(false)
    const location = useLocation()

    useEffect(() => {
        setDefaultPage(auth.isAuthenticated())
    }, [location])

    const photoURL = defaultPage.user ? '/api/users/photo/' + defaultPage.user._id : imageHomePage

    return (
        <div style={sxStyle.root}>
            <Grid container spacing={8}>
                <Grid item xs={12}>
                    <Card sx={sxStyle.card}>
                        <Typography variant="h6" sx={sxStyle.title}>
                            Home page
                        </Typography>
                        <CardContent>
                            {
                                defaultPage ?
                                    <>
                                        <CardMedia sx={sxStyle.media} image={imageBackGround} title={`Profile picture of ${defaultPage.user.name}`} >
                                        <Avatar elevation={2} src={'/api/users/photo/' + defaultPage.user._id} sx={sxStyle.bigAvatar}/>
                                        </CardMedia>
                                        <Typography variant='body2' component="p" sx={sxStyle.credit} color="textSecondary">{`Photo by ${defaultPage.user.name}`}</Typography>
                                        <Typography>
                                            Welcome to the Social Media <span style={{ color: 'red' }}>{upperCase(defaultPage.user.name)}</span>
                                        </Typography>
                                    </>
                                    :
                                    <>
                                        <CardMedia sx={sxStyle.media} image={imageHomePage} title="Social Media" />
                                        <Typography variant='body2' component="p" sx={sxStyle.credit} color="textSecondary">Photo by ...</Typography>
                                        <Typography type="body1" component="p">
                                            Welcome to the Social Media
                                        </Typography></>
                            }
                        </CardContent>

                    </Card>
                </Grid>
            </Grid>
            {
                defaultPage &&
                <Grid container spacing={8}>
                    <Grid item xs={12} sm={7}>
                        <Newsfeed />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <FindPeople />
                    </Grid>
                </Grid>


            }
        </div>
    )
}

export default Home;
import React, { useState } from 'react'
import { AppBar, Avatar, Box, Tab, Tabs, Typography } from '@mui/material'
import FollowGrid from './FollowGrid'
import PostList from '../post/PostList'


const ProfileTabs = (props) => {
    const [tab, setTab] = useState(0)

    const handleTabChange = (event, value) => {
        setTab(value)
    }



    return (
        <Box>
            <AppBar position='static' >
                <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" textColor="inherit">
                    <Tab label="Posts" />
                    <Tab label="Following" />
                    <Tab label="Followers" />
                </Tabs>
            </AppBar>
            {tab === 0 && <TabContainer value={tab}><PostList removeUpdate={props.removePostUpdate} posts={props.posts} /></TabContainer>}
            {tab === 1 && <TabContainer value={tab}><FollowGrid people={props.user.following} /></TabContainer>}
            {tab === 2 && <TabContainer value={tab}><FollowGrid people={props.user.followers} /></TabContainer>}
        </Box>
    )
}


const TabContainer = (props) => {

    return (
        <Typography component="div" style={{padding: 8 * 2}}>
            {props.children}
        </Typography>
    )
}

export default ProfileTabs
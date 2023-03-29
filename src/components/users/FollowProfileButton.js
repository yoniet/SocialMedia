import React from 'react'
import { Button } from "@mui/material"
import PropTypes from 'prop-types'
import { unfollow, follow } from './api-user'


const FollowProfileButton = (props) => {

    const followClick = () => {
        props.onButtonClick(follow)
    }

    const unfollowClick = () => {
        props.onButtonClick(unfollow)
    }

    return (
        <div>
            {
                props.following
                    ? (<Button variant="contained" 
                        onClick={unfollowClick} >Unfollow</Button>)
                    : (<Button variant="contained" 
                        onClick={followClick} >Follow</Button>)
            }
        </div>
    )
}

FollowProfileButton.propType = {
    following: PropTypes.bool.isRequired,
    onButtonClick: PropTypes.func.isRequired
}

export default FollowProfileButton
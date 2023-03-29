
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Grid } from '@mui/material/'
import { Box } from '@mui/material'
import { Avatar, ListItem, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import theme from '../../theme'


const sxStyle = {
    root: {
        paddingTop: theme.spacing(2),
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        background: theme.palette.background.paper
    },
    bigAvatar: {
        width: 60,
        height: 60,
        margin: 'auto'
    },
    gridList: {
        width: 500,
        height: 200
    },
    titleText: {
        textAlign: 'center',
        marginTop: 2
    }
}

const FollowGrid = (props) => {

    return (
        <Box sx={sxStyle.root} >
            <Grid container direction="row" justifyContent="center" alignItems="center" spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}  >
                {props.people ? props.people.map((person, i) => (
                    <Grid item xs={2} sm={4} md={3} key={i}  >
                        <ListItem >
                            <Link to={"/user/" + person._id} style={{ textDecoration: 'none' }} >
                                <Avatar src={'/api/users/photo/' + person._id} sx={sxStyle.bigAvatar}/>
                                <Typography sx={sxStyle.titleText}>
                                    {person.name}
                                </Typography>
                            </Link>
                        </ListItem>
                    </Grid>
                ))
                : undefined
                }
            </Grid>
        </Box>

    )
}


// FollowGrid.prototype = {
//     people: PropTypes.array.isRequired
// }

export default FollowGrid
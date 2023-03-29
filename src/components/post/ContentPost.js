import { CardContent, Typography } from '@mui/material';
import React from 'react';


const ContentPost = (props) => {

    return (
        <CardContent>
            <Typography component="p">
                {props.text}
            </Typography>
            {
                props.photo && 
                <div>
                    <img src={'/api/posts/photo/' + props.id} />
                </div>
            }
        </CardContent>
    )
}

export default ContentPost
import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

export default function CloudButton(){
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null); 
    };

    return (
        <div>
            <IconButton aria-label="open-menu" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                <MoreVertIcon/>
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
            <MenuItem onClick={handleClose}>Filter</MenuItem>
            <MenuItem onClick={handleClose}>Aggregate</MenuItem>
            <MenuItem onClick={handleClose}>Inspect</MenuItem>
            </Menu>
        </div>
    )
}
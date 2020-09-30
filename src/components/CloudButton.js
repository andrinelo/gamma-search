import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React from 'react';

import {setActiveWindow} from '../actions/SetActiveWindow.js';
import { useDispatch } from 'react-redux'

import PropTypes from 'prop-types';

// Sets which window to open based on click

const mapDispatchToProps = dispatch => {
    return {
        setActiveWindow: (type) => dispatch(setActiveWindow(type)),
    }
}

// button for clicking 
export default function CloudButton(props){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const dispatch = useDispatch()

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget); // move menu to where the ... button is
    };

    const handleClose = () => {
        setAnchorEl(null); 
        dispatch(setActiveWindow(''));
    };

    // dispatches action to open filter window
    const handleOpenFilter = () => {
        setAnchorEl(null); 
        dispatch(setActiveWindow('filter'));
    };

    // dispatches action to open aggregatewindow
    const handleOpenAggregate = () => {
        setAnchorEl(null); 
        dispatch(setActiveWindow('aggregate'));

    };

    // dispatches action to inspect cloud
    const handleOpenInspect = () => {
        setAnchorEl(null); 
        dispatch(setActiveWindow('inspect'));
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
            <MenuItem onClick={handleOpenFilter}>Filter</MenuItem>
            <MenuItem onClick={handleOpenAggregate}>Aggregate</MenuItem>
            <MenuItem onClick={handleOpenInspect}>Inspect</MenuItem>
            </Menu>
        </div>
    )
}

CloudButton.propTypes = {
    setActiveWindow: PropTypes.func.isRequired
}


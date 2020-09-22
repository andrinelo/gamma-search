import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React from 'react';

import {setActiveWindow} from '../actions/SetActiveWindow.js';
import { connect } from 'react-redux'

import PropTypes from 'prop-types';

// Sets which window to open based on click

const mapDispatchToProps = dispatch => {
    return {
        setActiveWindow: (type) => dispatch(setActiveWindow(type)),
    }
}

// button for clicking 
function CloudButton(props){
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget); // move menu to where the ... button is
    };

    const handleClose = () => {
        setAnchorEl(null); 
        props.setActiveWindow('');
    };

    // dispatches action to open filter window
    const handleOpenFilter = () => {
        setAnchorEl(null); 
        props.setActiveWindow('filter');
    };

    // dispatches action to open aggregatewindow
    const handleOpenAggregate = () => {
        setAnchorEl(null); 
        props.setActiveWindow('aggregate');

    };

    // dispatches action to inspect cloud
    const handleOpenInspect = () => {
        setAnchorEl(null); 
        props.setActiveWindow('inspect');
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

export default connect(null, mapDispatchToProps)(CloudButton);
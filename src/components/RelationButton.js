import React from 'react';
import RelationMenu from "./RelationMenu"
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
//<RelationMenu></RelationMenu>

function RelationButton() {

    const [isOpen, setIsOpen] = React.useState(false);

    const showMenu = () => {
        setIsOpen(!isOpen);
    }

  return (
    <div>
        <IconButton onClick={() => showMenu()}>
            <MoreVertIcon/>
        </IconButton>
        {isOpen ? <RelationMenu showMenu={showMenu}></RelationMenu> : null}
        
    </div>
  );
}

export default RelationButton;
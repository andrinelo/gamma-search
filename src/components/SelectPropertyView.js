import React from 'react';
import { connect } from 'react-redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { DeleteForever } from '@material-ui/icons';


const mapStateToProps = state => {
  return { 
    nodes: state.outputText
  }
}

function SelectPropertyView(props){
  
  const nodePropertyValues = ["all", "name", "age", "city", "horse"];
  const aggregateFunctions = ["count", "sum", "avg"];
  const menuItem = (value, text) => <MenuItem key={value} value={value}>{text}</MenuItem>;
  const handleChange = () => {console.log("true")};

  return(
    <div>
      <Box display="flex" flexDirection="row">
        <Box>
          <Box display="flex">
            <Box>Property type:</Box>
            <Box>
              <Select
                labelId="select aggregate function"
                id="select-prop"
                onChange={handleChange}
                value=''
              >
                {nodePropertyValues.map((value,key) => menuItem(key, value))}
              </Select>
            </Box>
          </Box>
          <Box display="flex">
            <Box>Aggregate function:</Box>
            <Box>
              <Select
                labelId="select aggregate function"
                id="select-prop"
                onChange={handleChange}
                value=''
              >
                {aggregateFunctions.map((value,key) => menuItem(key, value))}
              </Select>
            </Box>
          </Box>
        </Box>
        <IconButton>
          <DeleteForever/>
        </IconButton>
      </Box>
      
    </div>
  );
};

export default connect(mapStateToProps)(SelectPropertyView);
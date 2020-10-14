import React from 'react';
import { connect } from 'react-redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { DeleteForever } from '@material-ui/icons';


const mapStateToProps = (state, ownProps) => {
  return { 
    nodes: state.outputText
  }
}

function SelectPropertyView(props){

  const nodePropertyValues = ["all", "name", "age", "city", "horse"];
  const aggregateFunctions = ["count", "sum", "avg"];
  return(
    <div>
      <Box display="flex" flexDirection="row" justifyContent="center">
        <Box>
          <Box display="flex">
            <Box>Property type:</Box>
            <Box>
              <Select
                labelId="select property type"
                id="proptype"
                onChange={(e) => props.onChange(e, "proptype")}
                value={props.proptype}
              >
                {nodePropertyValues.map((value,key) => <MenuItem key={key} value={value}>{value}</MenuItem>)}
              </Select>
            </Box>
          </Box>
          <Box display="flex">
            <Box>Aggregate function:</Box>
            <Box>
              <Select
                labelId="select aggregate function"
                id="aggregateFunction"
                onChange={(e) => props.onChange(e, "aggregateFunction")}
                value={props.aggregateFunction}
              >
                {aggregateFunctions.map((value,key) => <MenuItem key={key} value={value}>{value}</MenuItem>)}
              </Select>
            </Box>
          </Box>
        </Box>
        <IconButton onClick={()=>props.onDelete()}>
          <DeleteForever/>
        </IconButton>
      </Box>
      <hr/>
    </div>
  );
};

export default connect(mapStateToProps)(SelectPropertyView);
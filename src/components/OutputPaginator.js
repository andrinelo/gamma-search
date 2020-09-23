import { Box, Button, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetPageNumber, increasePageNumber, decreasePageNumber } from "../actions/OutputPageActions";



const useStyles = makeStyles({
    flexBox: {
        display: "flex",
        justifyContent: "center",
    }
})

export default function OutputPaginator(props) {
    const classes = useStyles();
    const value = useSelector(state => state.OutputPaginationReducer )
    const dispatch = useDispatch()
    if (value == 0 && value >= props.pageCount) {
        return (
            <Box class={classes.flexBox}>
                <Typography>
                    {value}
                </Typography>
            </Box>
        )
    }
    else if (value == 0) {
      return (
        <Box class={classes.flexBox}>
          <Typography>
              {value}
          </Typography>
          <Button onClick={() => dispatch(increasePageNumber())}>Next page</Button>
        </Box>
      )
    }
    else {
      return (
        <Box class={classes.flexBox}>
          <Button onClick={() => dispatch(decreasePageNumber())}>Previous page</Button>
          <Typography>
            {value}
          </Typography>
          <Button onClick={() => dispatch(increasePageNumber())}>Next page</Button>
        </Box>
      )
    }
}


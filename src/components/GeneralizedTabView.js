import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

// Use component FullWidthTabs with props tabNames and tabValues, which is respectively the name of each tab and its contents

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={'span'}>{children}</Typography> {/* component span, changes it from a p tag to a span tag. This removes some workings like having div's inside p
                                                                  This can be removed if it causes any truble */}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
}));

function FullWidthTabs(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);

    if(props.setActiveTab){
      props.setActiveTab(newValue)
    }
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };
  
  const tabNames = []
  const tabValues = []

  for (var i = 0; i < props.tabNames.length; i++) {
    tabNames.push(<Tab key={i} label={props.tabNames[i]} {...a11yProps(i)} />)
  }

  for (var j = 0; j < props.tabValues.length; j++) {
    tabValues.push( <TabPanel key={j} value={value} index={j} dir={theme.direction}>
                      {props.tabValues[j]}
                    </TabPanel>)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          {tabNames}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        {tabValues}
      </SwipeableViews>
    </div>
  );
}

export default React.memo(FullWidthTabs)
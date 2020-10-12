import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

class SimpleTabs extends React.PureComponent {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="客戶基本資料" />
            <Tab label="客戶訂閱資訊" />
            <Tab label="產出/發送報吿" />
          </Tabs>
        </AppBar>
        {value === 0 && (
          <React.Fragment>
            <Typography component="div" style={{ padding: 8 * 3 }}>
              客戶名：思序網路有限公司
            </Typography>
            <Typography component="div" style={{ padding: 8 * 3 }}>
              連絡信箱：rick.chen@vaxal.io
            </Typography>
            <Typography component="div" style={{ padding: 8 * 3 }}>
              聯絡人：陳宗麟
            </Typography>
          </React.Fragment>
        )}
        {value === 1 && (
          <TabContainer>
            客戶資料
          </TabContainer>
        )}
        {value === 2 && (
          <TabContainer>
            客戶資料
          </TabContainer>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(SimpleTabs);

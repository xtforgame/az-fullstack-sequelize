import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import AddIcon from '@material-ui/icons/Add';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { FormTextField, FormSpace } from 'azrmui/core/FormInputs';
// import InstagramPostPicker from '../../InstagramPostPicker';

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
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    // padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
    padding: 24,
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
    const { classes, row, columns, refresh = () => {} } = this.props;
    const { value } = this.state;

    console.log('row, columns :', row, columns);

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="商品基本資料" />
            <Tab label="社群連結" />
            <Tab label="尺寸/試穿報告" />
            {/* <Tab label="其他擴充功能" /> */}
            {/* <div style={{ flex: 1 }} />
            <Button color="secondary" variant="outlined" style={{ color: 'white' }}>
              儲存
            </Button> */}
          </Tabs>
        </AppBar>
        {value === 0 && (
          <React.Fragment>
            <Typography component="div" style={{ padding: 8 * 3 }}>
              商品編號：
              {row.name}
            </Typography>
            <Typography component="div" style={{ padding: 8 * 3 }}>
              商品名稱：
              {row.goodName}
            </Typography>
            {/* <Typography component="div" style={{ padding: 8 * 3 }}>
              聯絡人：陳宗麟
            </Typography> */}
          </React.Fragment>
        )}
        {value === 1 && (
          <React.Fragment>
            <Typography component="div" style={{ padding: 8 * 3 }}>
              商品編號：
              {row.name}
            </Typography>
            <Typography component="div" style={{ padding: 8 * 3 }}>
              商品名稱：
              {row.goodName}
            </Typography>
            {/* <div className={classes.searchBar}>
              <FormTextField
                id="tag"
                label="Instagram Hash Tag"
                // onPressEnter={e => setSearchQuery(e.target.value)}
                value="allsaints"
                onChange={e => null}
                // autoFocus
                margin="dense"
                fullWidth
              />
            </div> */}
            <div className={classes.searchBar}>
              {/* <InstagramPostPicker
                goodData={row}
                onChange={() => { refresh() }}
              /> */}
              {/* <FormTextField
                id="lin01"
                label="Instagram 貼文連結"
                // onPressEnter={e => setSearchQuery(e.target.value)}
                value="https://www.instagram.com/p/CGFHic6gO6o/"
                onChange={e => null}
                // autoFocus
                disabled
                margin="dense"
                fullWidth
              />
              <IconButton size="small" onClick={e => null}>
                <AddIcon />
              </IconButton> */}
            </div>
            {/* <img width={400} src={'https://www.instagram.com/p/CGFHic6gO6o/media/?size=l'} /> */}
            {/* <div className={classes.searchBar}>
              <FormTextField
                id="lin02"
                label="Instagram 貼文連結"
                // onPressEnter={e => setSearchQuery(e.target.value)}
                value="https://www.instagram.com/p/CGJhk0NHDcC/"
                onChange={e => null}
                disabled
                // autoFocus
                margin="dense"
                fullWidth
              />
              <IconButton size="small" onClick={e => null}>
                <AddIcon />
              </IconButton>
            </div> */}
            {/* <img width={400} src={'https://www.instagram.com/p/CGJhk0NHDcC/media/?size=l'} /> */}
          </React.Fragment>
        )}
        {value === 2 && (
          <React.Fragment>
            <Typography component="div" style={{ padding: 8 * 3 }}>
              商品編號：
              {row.name}
            </Typography>
            <Typography component="div" style={{ padding: 8 * 3 }}>
              商品名稱：
              {row.goodName}
            </Typography>
            <div className={classes.searchBar}>
              <FormTextField
                id="sizes"
                label="尺寸對照表(HTML)"
                // onPressEnter={e => setSearchQuery(e.target.value)}
                defaultValue={row.sizes || ''}
                // autoFocus
                margin="dense"
                fullWidth
              />
            </div>
            <div className={classes.searchBar}>
              <FormTextField
                id="wearreport"
                label="試穿報告(HTML)"
                // onPressEnter={e => setSearchQuery(e.target.value)}
                defaultValue={row.fits || ''}
                // autoFocus
                margin="dense"
                fullWidth
              />
            </div>
          </React.Fragment>
        )}
        {/* {value === 3 && (
          <TabContainer>
            商品資料
          </TabContainer>
        )} */}
      </div>
    );
  }
}

export default withStyles(styles)(SimpleTabs);

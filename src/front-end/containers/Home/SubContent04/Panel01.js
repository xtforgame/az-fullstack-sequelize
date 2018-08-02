import React from 'react';
import { compose } from 'recompose';
import InputDialog from '~/components/Dialogs/InputDialog';
import { withStyles } from '@material-ui/core/styles';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DetailedExpansionPanel from './DetailedExpansionPanel';

const styles = theme => ({
  space: {
    height: 20,
  },
  dialogContent1: {
    flex: 'none',
    overflowY: 'visible',
  },
  dialogContent2: {
    padding: 0,
  },
});

class Panel01 extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      dialogOpend: false,
    };
  }

  handleOpen = (title, param) => () => {
    this.setState({
      dialogOpend: true,
      editingParam: param,
      editingParamTitle: title,
    });
  }

  handleClose = (data) => {
    const newState = {
      dialogOpend: false,
      editingParam: null,
      editingParamTitle: null,
    };
    if (data !== false) {
      newState[this.state.editingParam] = data;
    }

    this.setState(newState);
  }

  render() {
    const {
      expanded,
      onChange,
      onDone,
    } = this.props;
    const {
      httpPort,
      httpsPort,
      editingParam,
      editingParamTitle,
    } = this.state;
    return (
      <React.Fragment>
        <DetailedExpansionPanel
          expanded={expanded}
          title="nginx"
          listItems={[
            (
              <ListItem
                key="httpPort"
                button
                onClick={this.handleOpen('Http Port', 'httpPort')}
              >
                <ListItemText
                  primary="Http Port"
                  secondary={httpPort || '<N/A>'}
                />
              </ListItem>
            ),
            (
              <ListItem
                key="httpsPort"
                button
                onClick={this.handleOpen('Https Port', 'httpsPort')}
              >
                <ListItemText
                  primary="Https Port"
                  secondary={httpsPort || '<N/A>'}
                />
              </ListItem>
            ),
          ]}
          onChange={onChange}
          onDone={onDone}
        />
        {editingParam && (
          <InputDialog
            id="param-input"
            title={editingParamTitle || ''}
            open={this.state.dialogOpend}
            onClose={this.handleClose}
          />
        )}
      </React.Fragment>
    );
  }
}

export default compose(
  withStyles(styles),
)(Panel01);

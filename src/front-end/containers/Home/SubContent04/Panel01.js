import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { FormTextInput, FormSpace } from '~/components/SignInSignUp';
import InputDialog from '~/components/Dialogs/InputDialog';
import { withStyles } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import DetailedExpansionPanel from './DetailedExpansionPanel';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

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
  constructor(...args){
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
    if(data !== false){
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
          title={'nginx'}
          listItems={[
            (<ListItem
              key="httpPort"
              button
              onClick={this.handleOpen('Http Port', 'httpPort')}
            >
              <ListItemText
                primary="Http Port"
                secondary={httpPort ? httpPort : '<N/A>'}
              />
            </ListItem>),
            (<ListItem
              key="httpsPort"
              button
              onClick={this.handleOpen('Https Port', 'httpsPort')}
            >
              <ListItemText
                primary="Https Port"
                secondary={httpsPort ? httpsPort : '<N/A>'}
              />
            </ListItem>),
          ]}
          onChange={onChange}
          onDone={onDone}
        />
        {editingParam && <InputDialog
          id="param-input"
          title={editingParamTitle || ''}
          open={this.state.dialogOpend}
          onClose={this.handleClose}
        />}
      </React.Fragment>
    );
  }
}

export default compose(
  withStyles(styles),
)(Panel01);

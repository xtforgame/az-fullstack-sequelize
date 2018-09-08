import React from 'react';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import ButtonBase from '@material-ui/core/ButtonBase';

const styles = theme => ({
  buttonBase: {
    marginTop: 8,
    marginBottom: 8,
    position: 'relative',
    textAlign: 'left',

    // width: '30%',
    padding: 0,
  },
});

class BotCard extends React.Component {
  render() {
    const {
      classes,
      buttonProps: {
        className: buttonClassName,
        ...buttonProps
      } = {},
      ...cardProps
    } = this.props;

    return (
      <ButtonBase
        focusRipple
        className={classnames(classes.buttonBase, buttonClassName)}
        {...buttonProps}
      >
        <Card {...cardProps} />
      </ButtonBase>
    );
  }
}

export default withStyles(styles, { withTheme: true })(BotCard);

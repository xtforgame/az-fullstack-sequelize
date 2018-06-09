// @flow weak

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Translate from '@material-ui/icons/Translate';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { compose } from 'recompose';
import { getCountryCodeFromBrowser } from './langToCountry';
import xkFlag from './xk.svg';

// import libphonenumber from 'google-libphonenumber';
// const cc2Rc =libphonenumber.metadata.countryCodeToRegionCodeMap;

const styles = theme => ({
});

class PhoneRegionSelect extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      anchorEl: null,
      open: false,
      selectedIndex: 0,
    };
  }

  handleClick = event => {
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  handleMenuItemClick = (event, index, locale) => {

  };

  getMenuItmes(){
    return ['TW', 'CN'].map((_locale, i) => {
      return (
        <MenuItem
          key={_locale}
          selected={true}
          onClick={event => this.handleMenuItemClick(event, i, _locale)}
        >
          {_locale}
        </MenuItem>
      );
    });
  }

  render(){
    const { classes, locale, dispatch, changeLocale, regionCode, ...props } = this.props;
    return (
      <div>
        <IconButton
          color="inherit"
          aria-owns={this.state.open ? 'language-menu' : null}
          aria-haspopup="true"
          {...props}
          onClick={this.handleClick}
        >
          <img
            alt={regionCode}
            src={regionCode === 'XK' ? xkFlag : `https://lipis.github.io/flag-icon-css/flags/4x3/${regionCode.toLowerCase()}.svg`}
            width="24"
          />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onClose={this.handleRequestClose}
        >
          {this.getMenuItmes()}
        </Menu>
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
)(PhoneRegionSelect);

import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import modelMap from '~/containers/App/modelMap';
import {
  makeUserSessionSelector,
} from '~/containers/App/selectors';

/*
  Assuming props containing:
    history  
    location
    match
 */
const TryRedirect = (props) => {
  const { 
    isAuthenticated, 
    component: Component,
    ...rest
  } = props;

  return (
    isAuthenticated ? (
      <Component {...rest}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: rest.location },
      }}/>
    )
  )
};

const mapStateToProps = createStructuredSelector({
  isAuthenticated: state => !!makeUserSessionSelector()(state),
});

export default connect(
  mapStateToProps,
  {},
)(TryRedirect);

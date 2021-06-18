import React from 'react';
import axios from 'axios';
import { useConnect } from 'azrmui/hooks/redux-react-hook-ex';
import { createStructuredSelector } from 'reselect';
import useStylesByNs from 'azrmui/styles/useStylesByNs';
import ThemeContainer from '~/containers/core/ThemeContainer';
import SubContent03 from '~/containers/Home/SubContent03';
import {
  makeUiThemeSelector,
} from './selectors';
// import { urlPrefix } from './env';

// axios({
//   method: 'get',
//   url: `${urlPrefix}api`,
// })
// .then(({ data }) => {
//   console.log('data :', data);
// });


const mapStateToProps = createStructuredSelector({
  uiTheme: makeUiThemeSelector(),
});

const mapDispatchToProps = {};

const AppInternal = ({ history, routes }) => {
  useStylesByNs(['global']);
  return (
    <div>
      <SubContent03 />
    </div>
  );
};

export default (props) => {
  const {
    uiTheme,
  } = useConnect(mapStateToProps, mapDispatchToProps);

  return (
    <ThemeContainer uiTheme={uiTheme}>
      <AppInternal {...props} />
    </ThemeContainer>
  );
};

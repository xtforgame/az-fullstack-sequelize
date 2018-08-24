/* eslint-disable flowtype/require-valid-file-annotation, no-underscore-dangle */
// https://github.com/mui-org/material-ui/blob/master/docs/src/modules/components/AppWrapper.js
import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';
import LanguageProvider from '~/containers/LanguageProvider';
import { MuiThemeProvider } from '@material-ui/core/styles';
import getPageContext, { updatePageContext } from '../styles/getPageContext';

// Inject the insertion-point-jss after docssearch
if (process.browser && !global.__INSERTION_POINT__) {
  global.__INSERTION_POINT__ = true;
  const styleNode = document.createComment('insertion-point-jss');
  const docsearchStylesSheet = document.querySelector('#insertion-point-jss');

  if (document.head && docsearchStylesSheet) {
    document.head.insertBefore(styleNode, docsearchStylesSheet.nextSibling);
  }
}

export default function withRoot(BaseComponent) {
  class WithRoot extends Component {
    constructor(...args) {
      super(...args);
      this.state = {
        prevProps: {
          uiTheme: {
            ...this.props.uiTheme,
          },
        },
      };
    }

    componentDidMount() {
      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector('#jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    static getDerivedStateFromProps(props, prevState) {
      if (typeof prevState.pageContext === 'undefined') {
        return {
          prevProps: props,
          pageContext: props.pageContext || getPageContext(props.uiTheme),
        };
      }

      const { prevProps } = prevState;

      if (
        props.uiTheme.paletteType !== prevProps.uiTheme.paletteType
        || props.uiTheme.direction !== prevProps.uiTheme.direction
      ) {
        return {
          prevProps: props,
          pageContext: updatePageContext(props.uiTheme),
        };
      }

      return null;
    }

    render() {
      const { pageContext } = this.state;
      return (
        <JssProvider
          jss={pageContext.jss}
          registry={pageContext.sheetsRegistry}
          generateClassName={pageContext.generateClassName}
        >
          <MuiThemeProvider theme={pageContext.theme} sheetsManager={pageContext.sheetsManager}>
            <React.Fragment>
              <CssBaseline />
              <LanguageProvider messages={this.props.messages}>
                <BaseComponent {...this.props} />
              </LanguageProvider>
            </React.Fragment>
          </MuiThemeProvider>
        </JssProvider>
      );
    }
  }

  return WithRoot;
}

/* eslint-disable flowtype/require-valid-file-annotation */

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
    static getDerivedStateFromProps(nextProps, prevState) {
      if (typeof prevState.pageContext === 'undefined') {
        return {
          prevProps: nextProps,
          pageContext: nextProps.pageContext || getPageContext(nextProps.uiTheme),
        };
      }
  
      const { prevProps } = prevState;

      if (
        nextProps.uiTheme.paletteType !== prevProps.uiTheme.paletteType ||
        nextProps.uiTheme.direction !== prevProps.uiTheme.direction
      ) {
        return {
          prevProps: nextProps,
          pageContext: updatePageContext(nextProps.uiTheme),
        };
      }
  
      return null;
    }

    constructor(...args){
      super(...args);
      this.state = {
        prevProps:{
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

    render() {
      const { pageContext } = this.state;
      return (
        <JssProvider
          registry={pageContext.sheetsRegistry}
          jss={pageContext.jss}
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

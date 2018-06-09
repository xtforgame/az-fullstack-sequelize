/* eslint-disable flowtype/require-valid-file-annotation */

import { create } from 'jss';
import { SheetsRegistry } from 'react-jss';
import preset from 'jss-preset-default';
import { createMuiTheme, createTypography } from '@material-ui/core/styles';
import { purple, green, orange, red, blue, black, pink, grey, common } from '@material-ui/core/colors';
import createGenerateClassName from '@material-ui/core/styles/createGenerateClassName';

// const theme = createMuiTheme({
//   palette: {
//     primary: purple,
//     secondary: green,
//   },
// });

export function getTheme(theme) {
  let paletteType = theme.paletteType;
  let primary = blue;
  let secondary = pink;
  let background = {
    paper: common.white,
    default: grey[50],
  };
  if(theme.paletteType === 'dark'){
    primary = black;
    background = {
      paper: grey[800],
      default: '#303030',
    };
  }else if(theme.paletteType === 'vaxal'){
    primary = {
      light: '#765cb7',
      main: '#463287',
      dark: '#120b59',
      contrastText: common.white,
    };
    secondary = {
      light: '#78deff',
      main: '#3dacd3',
      dark: '#007da2',
      contrastText: common.white,
    };
    background = {
      paper: grey[100],
      default: grey[200],
    };
    paletteType = 'light';
  }

  return createMuiTheme({
    direction: theme.direction,
    typography: {
      fontFamily: `"Noto Sans TC", "Noto Sans SC", "Noto Sans JP", "Roboto", sans-serif`,
    },
    palette: {
      primary,
      secondary,
      type: paletteType,
      background,
    },
    status: {
      success: {
        light: green[300],
        main: green[500],
        dark: green[700],
      },
      warning: {
        light: orange[300],
        main: orange[500],
        dark: orange[700],
      },
      danger: {
        light: red[300],
        main: red[500],
        dark: red[700],
      },
    },
  });
}

export const defaultUiTheme = {
  direction: 'ltr',
  // paletteType: 'light',
  paletteType: 'dark',
  // paletteType: 'vaxal',
}

// Configure JSS
const jss = create(preset());
jss.options.createGenerateClassName = createGenerateClassName;
jss.options.insertionPoint = 'insertion-point-jss';

function createPageContext(uiTheme) {
  return {
    jss,
    theme: getTheme(uiTheme || defaultUiTheme),
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    generateClassName: createGenerateClassName({
      productionPrefix: 'j', // Reduce the bandwidth usage.
    }),
  };
}

export function updatePageContext(uiTheme) {
  const pageContext = {
    ...global.__MUI_PAGE_CONTEXT__,
    theme: getTheme(uiTheme),
  };
  global.__MUI_PAGE_CONTEXT__ = pageContext;

  return pageContext;
}

export default function getPageContext(uiTheme) {
  // Make sure to create a new store for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return createPageContext(uiTheme);
  }

  // Reuse context on the client-side
  if (!global.__MUI_PAGE_CONTEXT__) {
    global.__MUI_PAGE_CONTEXT__ = createPageContext(uiTheme);
  }

  return global.__MUI_PAGE_CONTEXT__;
}

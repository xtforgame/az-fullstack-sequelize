export default theme => {
  return {
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
    appBarPlaceholder: {
      height: 56,
      [theme.breakpoints.up('sm')]: {
        height: 64,
      },
    },
    toolBar: {
      // minHeight: 48,
      // height: 48,
    },
  };
};

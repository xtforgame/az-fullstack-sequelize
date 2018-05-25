export default theme => ({
  raisedPrimary: {
    contrastText: theme.palette.getContrastText(theme.palette.primary.main),
    color: theme.status.success.contrastText,
    backgroundColor: theme.status.success.main,
    '&:hover': {
      backgroundColor: theme.status.success.dark,
      // Reset on mouse devices
      '@media (hover: none)': {
        backgroundColor: theme.status.success.main,
      },
    },
  },
});

export default theme => ({
  flexContainer: {
    display: 'flex',
  },
  textContainer: {
    cursor: 'text',
    wordWrap: 'break-word',
  },
  forgotPasswordContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  flex: {
    flex: 1,
  },
  loginBtn: {
    marginTop: 6,
    marginBottom: 6,
    float: 'right',
  },
  link: {
    cursor: 'pointer',
    color: theme.palette.secondary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

const styles = theme => ({
  root: {
    position: 'relative',
  },
  label: {
    "vertical-align": 'middle',
  //   "font-size": '0.825rem',
  },
  button: {
    minWidth: '100px',
    //fontWeight: 700,
    //display: 'inline-block',
    fontWeight: 700, // 400
    //border: `1px solid ${theme.palette.primary.main}`,
    transition: 'all 0.2s ease-in-out',
    padding: '1.25rem 2.5rem',
    letterSpacing: '0.03em',
    fontSize: '0.8rem',
    '&:hover': {
      backgroundColor: theme.palette.navigation.main, // -webkit-linear-gradient(45deg, #DB58C0, #47EABB)
      color: 'white',
      outline: '0'
    },
    color: 'white',
    'font-family': '"roboto-black", sans-serif',
    'font-size': '1.4rem',
    'text-transform': 'uppercase',
    'letter-spacing': '.3rem',
    margin: '4px 4px'
  },
  secondary: {
    //border: `1px solid ${theme.palette.secondary.main}`,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
    }
  },
  buttonProgress: {
    color: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

export default styles;

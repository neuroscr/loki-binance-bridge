const styles = theme => ({
  root: {
    position: 'relative',
  },
  label: {
    "font-size": '0.825rem',
  },
  button: {
    minWidth: '100px',
    //fontWeight: 700,
    display: 'inline-block',
    fontWeight: 400,
    //border: `1px solid ${theme.palette.primary.main}`,
    transition: 'all 0.2s ease-in-out',
    //padding: '0.8rem 2.5rem',
    //letterSpacing: '0.03em',
    //fontSize: '0.8rem',
    color: 'black',
    'font-family': '"roboto-black", sans-serif',
    'font-size': '1.4rem',
    'text-transform': 'uppercase',
    'letter-spacing': '.3rem',
    //height: '5.4rem',
    //'line-height': '5.4rem',
    //padding: '0 3rem',
    margin: '0 .8rem 1.2rem 0',
    backgroundColor: 'white',
    '&:hover': {
      background: '-webkit-linear-gradient(45deg, #DB58C0, #47EABB)',
      color: '#000000',
      outline: '0',
      //backgroundColor: theme.palette.primary.main,
      //color: 'white'
    }
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

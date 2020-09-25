import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Box } from '@material-ui/core';
import LazyLoad from 'react-lazy-load';
import { Header, Snackbar, ImageLoader, Swap } from 'components';
import styled from 'styled-components'

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

class SwapWrapper extends Component {
  state = {
    snackbar: {
      message: null,
      variant: 'success',
      open: false,
    }
  }

  showMessage = (message, variant) => {
    const snackbar = {
      message,
      variant: variant || 'error',
      open: true
    };
    this.setState({ snackbar });
  }

  closeMessage = (event, reason) => {
    if (reason === 'clickaway') return;
    const snackbar = {
      ...this.state.snackbar,
      open: false
    };
    this.setState({ snackbar });
  }

  renderSnackbar = () => {
    const { snackbar } = this.state;
    return <Snackbar message={snackbar.message} open={snackbar.open} onClose={this.closeMessage} variant={snackbar.variant} />;
  }

  renderTitleImage = () => {
    return (
      <Box display="flex" justifyContent="center" className="title">
        <LazyLoad height={'120px'} className="titleContainer">
          <ImageLoader className="titleImage" loadedClassName="titleImageLoaded" src="/images/logo.png" alt="Logo" />
        </LazyLoad>
      </Box>
    );
  }

  render() {
    const { classes } = this.props;
    const { page} = this.state;

    return (
      <div>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <div id="content">
          {this.renderTitleImage()}
          <Grid
            id="grid"
            container
            justify="center"
            alignItems="center"
          >
            <Grid item l={6}>
              <Swap showMessage={this.showMessage} />
              { this.renderSnackbar() }
            </Grid>
          </Grid>
        </div>
      </div>
    );
  };
}

export default SwapWrapper;

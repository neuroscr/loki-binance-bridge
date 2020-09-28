// StrictMode is from uniswap
import React, { PureComponent, StrictMode } from 'react';
import LazyLoad from 'react-lazy-load';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Grid, Box } from '@material-ui/core';
import { Snackbar,  Swap, ImageLoader, SwapWrapper, LokiButton, Web3Status } from 'components';
import About from 'pages/about';
import ToS from 'pages/tos';
import Staking from 'pages/staking';
import theme from 'theme/loki.js';
// from uniswap
import { Provider } from 'react-redux'
import store from './state'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { NetworkContextName } from './constants'
import getLibrary from './utils/getLibrary'

import styled from 'styled-components'
import Header from 'components/Header'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'
import { HashRouter, Route, Switch, Link, NavLink } from 'react-router-dom'
import Web3ReactManager from 'components/Web3ReactManager'

/*
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import UserUpdater from './state/user/updater'
*/
const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

/*
if ('ethereum' in window) {
  ;(window.ethereum as any).autoRefreshOnNetworkChange = false
}
      <ListsUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
*/

function Updaters() {
  return (
    <>
    </>
  )
}

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

export default class App extends PureComponent {
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

  renderBackgroundImage = () => {
    return (
      <div id="background">
        <LazyLoad height={'100%'}>
          <ImageLoader className="backgroundImage" loadedClassName="backgroundImageLoaded" src="/images/chainflip_bg.png" alt="Background" />
        </LazyLoad>
      </div>
    );
  }

  renderTitleImage = () => {
    return (
      <Box display="flex" justifyContent="center" className="title">
        <LazyLoad height={'120px'} className="titleContainer">
          <ImageLoader className="titleImage" loadedClassName="titleImageLoaded" src="/images/WLOKI_white.svg" alt="Logo" />
        </LazyLoad>
      </Box>
    );
  }

  render() {
    return (
      <HashRouter>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Provider store={store}>
          <FixedGlobalStyle />
          <Updaters />
          <ThemeProvider>
            <ThemedGlobalStyle />
          <MuiThemeProvider theme={ createMuiTheme(theme) }>
            <CssBaseline />
            {this.renderBackgroundImage()}
            <Web3ReactManager>
              <div id="content">
                <p></p>
                <p></p>
                <Grid
                  container
                  justify="center"
                  alignItems="center"
                >
                  <Grid item xs={ 2 } align="center">
                    <NavLink to="/"><LokiButton
                      label="About"
                      to="/"
                    /></NavLink>
                  </Grid>
                  <Grid item xs={ 2 } align="center">
                    <NavLink to="/swap">
                      <LokiButton
                        label="Swap"
                        to="/swap"
                      />
                    </NavLink>
                  </Grid>
                  <Grid item xs={ 2 } align="center">
                    <NavLink to="/staking">
                      <LokiButton
                        label="Staking"
                        to="/staking"
                      />
                    </NavLink>
                  </Grid>
                </Grid>
                {this.renderTitleImage()}
                <Switch>
                  <Route exact strict path="/swap" component={SwapWrapper} />
                  <Route exact strict path="/tos" component={ToS} />
                  <Route exact strict path="/staking" component={Staking} />
                  <Route component={About} />
                </Switch>
                <Link to="/tos">terms of service</Link>
                Copyright 2020 Alchemy Luxe
              </div>
            </Web3ReactManager>

          </MuiThemeProvider>
          </ThemeProvider>
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
      </HashRouter>
    );
  }
}

/*
            <App />
            <div id="content">
              {this.renderTitleImage()}
              <Grid
                id="grid"
                container
                justify="center"
                alignItems="center"
              >
                <Grid item xs={12}>
                  <Swap showMessage={this.showMessage} />
                  { this.renderSnackbar() }
                </Grid>
              </Grid>
            </div>
*/

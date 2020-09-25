// StrictMode is from uniswap
import React, { PureComponent, StrictMode } from 'react';
import LazyLoad from 'react-lazy-load';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Grid, Box } from '@material-ui/core';
import { Snackbar, About, Swap, ImageLoader, SwapWrapper, Web3Status, ToS } from 'components';
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
import { HashRouter, Route, Switch, Link } from 'react-router-dom'
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
          <ImageLoader className="backgroundImage" loadedClassName="backgroundImageLoaded" src="/images/background.png" alt="Background" />
        </LazyLoad>
      </div>
    );
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
                <Switch>
                  <Route exact strict path="/swap" component={SwapWrapper} />
                  <Route exact strict path="/tos" component={ToS} />
                  <Route component={About} />
                </Switch>
                <Link to="/">About wLoki</Link>
                <Link to="/swap">Swap</Link>
                <Link to="/tos">TOS</Link>
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

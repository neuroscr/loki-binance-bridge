import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Link } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Input, Button, Select } from '@components';
import { SWAP_TYPE, TYPE } from '@constants';
import config from '@config';
import styles from './styles';
import Web3 from 'web3';

const walletCreationUrl = {
  [TYPE.LOKI]: config.loki.walletCreationUrl,
  [TYPE.WLOKI]: config.wloki.walletCreationUrl,
};

// https://medium.com/@awantoch/how-to-connect-web3-js-to-metamask-in-2020-fee2b2edf58a
const ethEnabled = () => {
  // window.ethereum will be undefined
  // check to see if MetaMask is installed
  if (window.ethereum) {
    //window.web3 = new Web3(window.web3.currentProvider);
    window.web3 = new Web3(window.ethereum)
    window.ethereum.enable();
    return true;
  }
  return false;
}

class SwapSelection extends Component {
  state = {
    address: '',
    addressError: false,
    options: [{
      value: SWAP_TYPE.LOKI_TO_WLOKI,
      description: 'LOKI to WLOKI',
    }, {
      value: SWAP_TYPE.WLOKI_TO_LOKI,
      description: 'WLOKI to LOKI',
    }],
  };

  constructor() {
    super();
    // if the first option value is SWAP_TYPE.LOKI_TO_WLOKI
    if (this.state.options && this.state.options.length &&
        this.state.options[0].value === SWAP_TYPE.LOKI_TO_WLOKI) {
      this.setAccountFromMetaMask();
    }
  }

  setAccountFromMetaMask = () => {
    const ethReady = ethEnabled()
    if (ethReady) {
      window.web3.eth.getAccounts().then(accounts => {
        // if we have an account, go ahead and set it
        if (accounts.length) {
          this.setState({ address: accounts[0]})
        }
      })
      // https://medium.com/better-programming/how-to-detect-when-a-user-changes-their-metamask-account-4611845b6415
      // handle registration with metamask and any changes in it
      window.ethereum.on('accountsChanged', (accounts) => {
        // if we have an account, go ahead and set it
        if (accounts.length) {
          // don't stomp a loki address
          if (this.props.swapType === SWAP_TYPE.LOKI_TO_WLOKI) {
            this.setState({ address: accounts[0]})
          }
        }
      })
    }
  }

  onNext = () => {
    const { address } = this.state;
    const { onNext } = this.props;

    const isValidAddress = address && address.length > 0;
    this.setState({ addressError: !isValidAddress });

    if (isValidAddress) onNext(address);
  }

  onAddressChanged = (event) => {
    this.setState({ address: event.target.value });
  }

  onSwapTypeChanged = (event) => {
    this.props.onSwapTypeChanged(event.target.value);
    if (event.target.value === SWAP_TYPE.LOKI_TO_WLOKI) {
      this.setAccountFromMetaMask();
    } else {
      // just clear it
      this.setState({ address: '' })
    }
  }

  getAddressType = () => {
    const { swapType } = this.props;
    return swapType === SWAP_TYPE.LOKI_TO_WLOKI ? TYPE.WLOKI : TYPE.LOKI;
  }

  render() {
    const { swapType, loading, classes } = this.props;
    const { options, address, addressError } = this.state;

    const addressType = this.getAddressType();
    const inputLabel = addressType === TYPE.LOKI ? 'Loki Destination Address' : 'ETH Destination Address';
    const inputPlaceholder = addressType === TYPE.LOKI ? 'L...' : '0x... or reload with MetaMask';

    const url = walletCreationUrl[addressType];

    return (
      <Grid item xs={ 12 } className={classes.root}>
        <Grid item xs={ 12 }>
          <Select
            fullWidth
            label="Swap Type"
            options={options}
            value={swapType}
            handleChange={this.onSwapTypeChanged}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={ 12 }>
          <Input
            fullWidth
            label={inputLabel}
            placeholder={inputPlaceholder}
            value={address}
            error={addressError}
            onChange={this.onAddressChanged}
            disabled={loading}
          />
          <Typography className={ classes.createAccount }>
            <Link href={url} target="_blank" rel="noreferrer">
              Don't have an account? Create one
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={ 12 } align='right' className={ classes.button }>
          <Button
            fullWidth
            label="Next"
            loading={loading}
            onClick={this.onNext}
          />
        </Grid>
      </Grid>
    );
  }
}

SwapSelection.propTypes = {
  classes: PropTypes.object.isRequired,
  swapType: PropTypes.string.isRequired,
  onSwapTypeChanged: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default withStyles(styles)(SwapSelection);

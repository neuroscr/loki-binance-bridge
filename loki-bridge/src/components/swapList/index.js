import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'timeago-react';
import dateformat from 'dateformat';
import { Grid, Typography, Box, Divider, Link } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import config from 'config';
import { SWAP_TYPE, TYPE } from 'utils/constants.js';
import styles from './styles';

const hashUrls = {
  [TYPE.LOKI]: config.loki.txExplorerUrl,
  [TYPE.WLOKI]: config.wloki.txExplorerUrl,
};

class SwapList extends Component {
  renderHash = (type, txHash, transferTxHashes) => {
    const { classes } = this.props;

    const hasTransferHashes = transferTxHashes.length > 0;
    const depositHashType = type === SWAP_TYPE.LOKI_TO_WLOKI ? TYPE.LOKI : TYPE.WLOKI;
    const transferHashType = type === SWAP_TYPE.LOKI_TO_WLOKI ? TYPE.WLOKI : TYPE.LOKI;
    const hashType = hasTransferHashes ? transferHashType : depositHashType;
    const baseUrl = hashUrls[hashType];

    const hashes = hasTransferHashes? transferTxHashes : [txHash];
    const hashItems = hashes.map(hash => {
      const url = `${baseUrl}/${hash}`;
      return (
        <Typography key={hash} className={classes.hash}>
          <Link href={url} target="_blank" rel="noreferrer">
            {hash}
          </Link>
        </Typography>
      );
    });

    if(transferTxHashes.length === 0) {
      return (
        <Box>
          <Typography className={classes.hashTitle}>Deposit Transaction Hash</Typography>
          {hashItems[0]}
        </Box>
      );
    }

    const swapTitle = transferTxHashes.length === 1 ? 'Swap Transaction Hash' : 'Swap Transaction Hashes';
    return (
      <React.Fragment>
        <Typography className={classes.hashTitle}>{swapTitle}</Typography>
        {hashItems}
      </React.Fragment>
    );
  }

  renderTime = (created) => {
    const { classes } = this.props;
    const now = Date.now();
    const diff = Math.abs(now - created);
    const dayMs = 24 * 60 * 60 * 1000;

    const showFullDate = diff > dayMs;
    if (showFullDate) {
      const formatted = dateformat(created, 'dd/mm/yyyy');
      return (
        <Typography className={classes.time}>{formatted}</Typography>
      );
    }

    return <TimeAgo className={classes.time} datetime={created} />;
  }

  renderSwapItem = ({ uuid, type, amount, txHash, transferTxHashes, created, unconfirmed, lokiFee }) => {
    const { classes } = this.props;

    const isPending = transferTxHashes && transferTxHashes.length === 0;
    const depositCurrency = type === SWAP_TYPE.LOKI_TO_WLOKI ? 'LOKI' : 'WLOKI';
    const fee = (lokiFee || 0) / 1e9;
    const displayAmount = (amount / 1e9) - fee;

    let status = 'Completed';
    if (isPending) {
      status = unconfirmed ? 'Waiting for Confirmations' : 'Pending';
    }

    const feeStatus = fee > 0 ? `(${fee} Fee)` : '';

    return (
      <Grid item xs={12} key={uuid}>
        <Box className={classes.item}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography className={classes.amount}>
              {displayAmount} {depositCurrency} {feeStatus}
            </Typography>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Typography
                className={isPending ? classes.pending : classes.completed}
              >
                {status}
              </Typography>
              <Typography className={classes.timeSeperator}> • </Typography>
              {this.renderTime(created)}
            </Box>
          </Box>
          <Divider variant="middle" className={classes.divider} />
          {this.renderHash(type, txHash, transferTxHashes)}
        </Box>
      </Grid>
    );
  }

  renderSwaps = () => {
    const { classes, swaps } = this.props;
    if (!swaps || swaps.length === 0) {
      return (
        <Box className={classes.item}>
          <Typography className={classes.emptyTitle}>No Transactions Found</Typography>
        </Box>
      );
    }

    return swaps.map(this.renderSwapItem);
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid item xs={ 12 } className={classes.root}>
        <Grid container direction="column" spacing={1}>
          {this.renderSwaps()}
        </Grid>
      </Grid>
    );
  }
}

SwapList.propTypes = {
  classes: PropTypes.object.isRequired,
  swaps: PropTypes.array
};

export default withStyles(styles)(SwapList);

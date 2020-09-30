import React, { PureComponent  } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import AnimateHeight from 'react-animate-height';
import { Grid, Typography, IconButton, Link, Tooltip, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { FileCopyOutlined as CopyIcon } from '@material-ui/icons';
import { LokiButton, QRIcon, Input } from 'components';
import { SWAP_TYPE } from 'utils/constants.js';
import styles from './styles';
import Web3 from 'web3';
import { TYPE } from '../../utils/constants';

const contractAddress = '0x1c37da7b6d7b428e8ac27187b0f8ebb9461d993a'

const getEthAccount = async () => {
  // check to see if MetaMask is installed
  if (window.ethereum && window.web3) {
    const accounts = await window.ethereum.send('eth_requestAccounts')
    if (!accounts.result) return false;
    const addr = accounts.result[0];
    const tknAddress = (addr).substring(2);
    // balanceOf in hex...
    const contractData = ('0x70a08231000000000000000000000000' + tknAddress);
    const maxAmount = await new Promise(resolve => {
      window.web3.eth.call({
        to: contractAddress,
        data: contractData,
      }, (err, result) => {
        if (err) console.error('err', err)
        const tokens = window.web3.utils.toBN(result).toString(); // Convert the result to a usable number string
        resolve(tokens / 1e9)
      })
    })
    return {
      address: addr,
      maxAmount
    }
  }
  return false;
}

// https://medium.com/@awantoch/how-to-connect-web3-js-to-metamask-in-2020-fee2b2edf58a
const ethEnabled = () => {
  // check to see if MetaMask is installed
  if (window.ethereum) {
    //window.web3 = new Web3(window.web3.currentProvider);
    window.web3 = new Web3(window.ethereum)
    window.ethereum.enable();
    return true;
  }
  return false;
}

class SwapInfo extends PureComponent {
  state = {
    showQR: false,
    qrSize: 128,
    amount: '0',
    fromAddress: '',
    minAmount: 0,
    maxAmount: 1,
  };

  onCopy = (id) => {
    var elm = document.getElementById(id);
    let range;
    // for Internet Explorer

    if (document.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(elm);
      range.select();
      document.execCommand('Copy');
    } else if (window.getSelection) {
      // other browsers
      var selection = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(elm);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('Copy');
    }
  };

  componentDidMount() {

    if (this.props.swapType === SWAP_TYPE.WLOKI_TO_LOKI) {
      getEthAccount().then(acctDetails => {
        const { info } = this.props;
        const lokiFee = (info && info.fees && info.fees.loki / 1e9) || 0;
        this.setState({
          fromAddress: acctDetails.address,
          minAmount: lokiFee + 1,
          maxAmount: acctDetails.maxAmount
        });
      });
    }

    // Run a timer every 10 seconds to refresh
    this.timer = setInterval(this.props.onRefresh, 2 * 60 * 1000);

    this.onResize();
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    clearInterval(this.timer);
  }

  onResize = () => {
    const width = window.innerWidth;
    const qrSize = (width <= 600) ? 128 : 210;
    this.setState({ qrSize });
  }

  toggleQR = () => {
    this.setState({ showQR: !this.state.showQR });
  }

  renderQR = () => {
    const { showQR, qrSize } = this.state;
    const { classes, swapInfo } = this.props;
    const { depositAddress } = swapInfo;
    const height = showQR ? 'auto' : 0;

    return (
      <AnimateHeight
        duration={250}
        height={height}
      >
        <Box className={classes.qrContainer}>
          <Box className={classes.qr}>
            <QRCode value={depositAddress} renderAs='canvas' size={qrSize} />
          </Box>
        </Box>
      </AnimateHeight>
    );
  }

  renderMemo = () => {
    const { classes, swapInfo: { memo }} = this.props;
    if (!memo) return null;

    return (
      <Box className={classes.memoFrame}>
        <Typography className={classes.warningText}>
          PLEASE READ CAREFULLY
        </Typography>
        <Typography id='memo' className={classes.memo}>
          {memo}
        </Typography>
        <Tooltip title="Copy Memo" placement="right">
          <IconButton onClick={() => this.onCopy('memo')} aria-label="Copy Memo">
            <CopyIcon/>
          </IconButton>
        </Tooltip>
        <Typography className={classes.instructionBold}>
          When creating the transaction, please paste the string above into the <b>Memo</b> field. <br/>
          Ensure that this is the only thing that you put in the field.
        </Typography>
        <Typography className={classes.warningText}>
          If done incorrectly then you will not receive <b>LOKI</b> into your designated address.
        </Typography>
      </Box>
    );
  }

  onBurn = async () => {
    const { minAmount, maxAmount, amount } = this.state;
    // warn user if amount is out of bounds
    if (Number(amount) < minAmount) {
      alert('Amount must be at least ' + minAmount)
      return
    }
    if (Number(amount) > maxAmount) {
      alert('You do not have more than ' + maxAmount)
      return
    }

    const abi = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"tokenOwner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"burner","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"string","name":"note","type":"string"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"tokenOwner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"approveAndCall","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_value","type":"uint256"},{"internalType":"string","name":"_note","type":"string"}],"name":"burnWithNote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"drip","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"transferAnyERC20Token","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
    const contractInstance = new window.web3.eth.Contract(abi, contractAddress);
    // we could want a max limit on trades...
    const bnValue = new window.web3.utils.BN(Number(this.state.amount));
    const bnScale = new window.web3.utils.BN(1e9);
    const bnFinal = bnValue.mul(bnScale);
    contractInstance.methods.burnWithNote(bnFinal, this.props.swapInfo.memo).send({
      from: this.state.fromAddress
    }, (err, res) => {
      if (err) console.error('err', err)
      console.log('burn res', res)
    })
  }

  onAmountChange = (event) => {
    let value = Number(event.target.value)
    if (isNaN(value)) return
    // allow numbers
    this.setState({
      amount: '' + value, // convert back to string because Input requires string
    })
  }

  renderDepositInstructions = () => {
    const { swapType, classes, swapInfo } = this.props;

    const { depositAddress } = swapInfo;
    const depositCurrency = swapType === SWAP_TYPE.LOKI_TO_WLOKI ? 'LOKI' : 'WLOKI';

    if (swapType === SWAP_TYPE.WLOKI_TO_LOKI) {
      if (!ethEnabled()) {
        return (
          <React.Fragment>
            <Typography className={ classes.instructionBold }>
                Please connect your web3-enabled wallet
            </Typography>
          </React.Fragment>
        )
      }
      const { loading } = this.props;
      return (
        <React.Fragment>
          <Box className={classes.memoFrame}>
            <Input
              fullWidth
              value={this.state.amount}
              onChange={this.onAmountChange}
              label="How much wLoki do you want to transfer? "
              loading={loading}
            />
            <LokiButton
              fullWidth
              label="Send"
              loading={loading}
              onClick={this.onBurn}
            />
          </Box>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <Typography className={ classes.instructionBold }>
            Transfer your {depositCurrency}
        </Typography>
        <Typography className={ classes.instructions }>
            to
        </Typography>
        <Typography component={'div'} className={ classes.instructionBold }>
          <Box id='depositAddress'>{depositAddress}</Box>
          <Box>
            <Tooltip title="Copy Address" placement="left">
              <IconButton onClick={() => this.onCopy('depositAddress')} aria-label="Copy Address">
                <CopyIcon/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Toggle QR" placement="right">
              <IconButton onClick={this.toggleQR} aria-label="Toggle QR">
                <QRIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Typography>
        {this.renderQR() }
        {this.renderMemo() }
      </React.Fragment>
    );
  }

  renderInstructions = () => {
    const { swapType, classes, info } = this.props;

    const receivingCurrency =
      swapType === SWAP_TYPE.LOKI_TO_WLOKI ? TYPE.WLOKI : TYPE.LOKI;
    const lokiFee =
      (info && info.fees && (info.fees[receivingCurrency] || 0) / 1e9) || 0;

    function createMarkup() {
      return {__html: "<a class='MuiTypography-colorPrimary' href='&#109;ai&#108;to&#58;&#37;74eam&#64;cha%69n%&#54;6li%7&#48;%2E&#37;6&#57;&#111;'>&#116;eam&#64;c&#104;a&#105;nf&#108;i&#112;&#46;io</a>"};
    }

    return (
      <Box className={classes.instructionContainer}>
        <Typography className={ classes.instructions }>
            Here's what you need to do next:
        </Typography>
        {this.renderDepositInstructions()}
        <Typography className={ classes.instructions }>
          There will be a processing fee of {lokiFee} LOKI which will be charged when processing all your pending swaps.
        </Typography>
        <Typography className={ classes.instructions }>
            If you run into any trouble, or your swap request has not gone through, please contact us.
        </Typography>
        <Typography className={classes.link} dangerouslySetInnerHTML={createMarkup()} />
      </Box>
    );
  }

  render() {
    const { classes, loading, onRefresh, onBack } = this.props;

    return (
      <div className={classes.root}>
        <Grid item xs={ 12 } align='left' className={ classes.back }>
          <Typography>
            <Link className={classes.link} onClick={onBack}>
              &lt; Back
            </Link>
          </Typography>
        </Grid>
        {this.renderInstructions()}
        <Grid item xs={12} className={classes.button}>
          <LokiButton
            fullWidth
            label="Refresh"
            loading={loading}
            onClick={onRefresh}
          />
        </Grid>
      </div>
    );
  }
}

SwapInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  swapType: PropTypes.string.isRequired,
  swapInfo: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default withStyles(styles)(SwapInfo);

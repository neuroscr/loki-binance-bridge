import React, { Component } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { Link } from "react-router-dom";

class About extends Component {

  render() {

    return (
<div>
  <Box display="flex" justifyContent="center" className="title">
    <h1>About wLoki</h1>
  </Box>
  <Grid
    id="grid"
    container
    justify="center"
    alignItems="center"
  >
    <Grid item md={8}>
      <div className="readable">
<p>Loki is a blockchain project that allows users to trade and communicate with increased levels of privacy. Loki runs on its own Monero-based blockchain, meaning Loki by itself can’t be used to interact with many popular Ethereum-based tools.</p>
<p>In order to provide users greater access to Loki, Chainflip.io is providing a wrapping service with the support and oversight of the Loki Foundation.</p>
<p>Wrapped Loki, or wLoki, is an ERC20-compatible token issued by the Loki Foundation on the Ethereum blockchain that can be exchanged for native Loki tokens on the Loki blockchain.</p>

<h2>How does it work?</h2>
<p>wLoki is minted under the oversight of the Loki Foundation. Every single wLoki in circulation is fully backed by a Loki coin stored on the Loki blockchain. When you deposit Loki into the wLoki bridge, you will receive wLoki tokens to your specified wallet address on the Ethereum blockchain.</p>
<p>When it’s time to turn your wLoki back into Loki tokens, you can unwrap wLoki by provably burning it through the bridge software. You must use a Web3.0 compatible wallet such as Metamask, which will unwrap your Loki by automatically including your Loki address in the burn transaction that you send through the wLoki bridge.</p>

<h2>How safe is wLoki?</h2>
<p>The wLoki smart contract is a direct copy of the highly audited wBTC smart contract, with a minor change that has been approved by several external Ethereum developers. To see the contents of the smart contract and the details of the changes, head to <a target="_blank" href="https://github.com/chainflip-team/wLoki-smart-contract">https://github.com/chainflip-team/wLoki-smart-contract</a></p>
<p>The wLoki bridge is provided to you by Chainflip. We strongly recommend you read the full terms of service, and understand that this is fundamentally a custodial service for the time being. With correct oversight being provided by the Loki Foundation, there is little scope for the bridge to go down irrecoverably. However, users of wLoki should be aware that Chainflip is unable to provide an absolute guarantee that wLoki will be redeemable 1:1 with Loki forever, and users should asses the risks before deciding to hold wLoki.</p>

<h2>What's the future of wLoki?</h2>
<p>wLoki is being provided as a service to the Loki and Chainflip community. This service will operate through Chainflip’s wLoki bridge until Chainflip launches its decentralised wLoki/Loki pool, at which point the bridge will be terminated in favour of this better solution. You can find out more about this decentralised method of cross-chain exchange by reading the Chainflip whitepaper, available at chainflip.io.</p>
      </div>
    </Grid>
  </Grid>
</div>
    );
  };
}

export default About;

import React, { Component } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { Link } from "react-router-dom";

class Staking extends Component {

  render() {

    return (
<div>
  <Box display="flex" justifyContent="center" className="title">
    <h1>Staking information content</h1>
  </Box>

  <Grid
    id="grid"
    container
    justify="center"
    alignItems="center"
  >
    <Grid item md={8}>
      <Typography>
<h2>wLoki</h2>

<p>Earn wLoki by providing liquidity to the wLoki-USDT Uniswap pool</p>

<h2>Rewards</h2>

<p>Once every 24 hours, a total of 4,320 will be rewarded to liquidity providers proportionally based on their holdings of the wLokiUSDT-UNI-LP token. For now, rewards do not need to be claimed; they are sent automatically at a random time selected in each 24-hour window.</p>

<h2>Rewards Schedule</h2>

<p>The initial tranche of rewards will last for 1 week ending on XYZ. Rewards for successive weeks will be adjusted and announced here.</p>


<p>APY if $1000 was added to pool, with wLoki at current price</p>

<table>
  <tr>
    <th>Liquidity in Pool</th>
    <th>Incentive APY</th>
  </tr>
  <tr>
    <td>$100,000</td>
    <td></td>
  </tr>
  <tr>
    <td>$500,000</td>
    <td></td>
  </tr>
  <tr>
    <td>$1,000,000</td>
    <td></td>
  </tr>
</table>

      </Typography>
    </Grid>
  </Grid>
</div>
    );
  };
}

export default Staking;

"use strict";
var _a;
var _b;
exports.__esModule = true;
exports.walletlink = exports.portis = exports.fortmatic = exports.walletconnect = exports.injected = exports.getNetworkLibrary = exports.network = exports.NETWORK_CHAIN_ID = void 0;
var providers_1 = require("@ethersproject/providers");
var injected_connector_1 = require("@web3-react/injected-connector");
var walletconnect_connector_1 = require("@web3-react/walletconnect-connector");
var walletlink_connector_1 = require("@web3-react/walletlink-connector");
var portis_connector_1 = require("@web3-react/portis-connector");
var Fortmatic_1 = require("./Fortmatic");
var NetworkConnector_1 = require("./NetworkConnector");
var NETWORK_URL = process.env.REACT_APP_NETWORK_URL;
var FORMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY;
var PORTIS_ID = process.env.REACT_APP_PORTIS_ID;
exports.NETWORK_CHAIN_ID = parseInt((_b = process.env.REACT_APP_CHAIN_ID) !== null && _b !== void 0 ? _b : '1');
if (typeof NETWORK_URL === 'undefined') {
    throw new Error("REACT_APP_NETWORK_URL must be a defined environment variable");
}
exports.network = new NetworkConnector_1.NetworkConnector({
    urls: (_a = {}, _a[exports.NETWORK_CHAIN_ID] = NETWORK_URL, _a)
});
var networkLibrary;
function getNetworkLibrary() {
    return (networkLibrary = networkLibrary !== null && networkLibrary !== void 0 ? networkLibrary : new providers_1.Web3Provider(exports.network.provider));
}
exports.getNetworkLibrary = getNetworkLibrary;
exports.injected = new injected_connector_1.InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42]
});
// mainnet only
exports.walletconnect = new walletconnect_connector_1.WalletConnectConnector({
    rpc: { 1: NETWORK_URL },
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: 15000
});
// mainnet only
exports.fortmatic = new Fortmatic_1.FortmaticConnector({
    apiKey: FORMATIC_KEY !== null && FORMATIC_KEY !== void 0 ? FORMATIC_KEY : '',
    chainId: 1
});
// mainnet only
exports.portis = new portis_connector_1.PortisConnector({
    dAppId: PORTIS_ID !== null && PORTIS_ID !== void 0 ? PORTIS_ID : '',
    networks: [1]
});
// mainnet only
exports.walletlink = new walletlink_connector_1.WalletLinkConnector({
    url: NETWORK_URL,
    appName: 'Uniswap',
    appLogoUrl: 'https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg'
});

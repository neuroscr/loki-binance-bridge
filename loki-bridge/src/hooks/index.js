"use strict";
exports.__esModule = true;
exports.useInactiveListener = exports.useEagerConnect = exports.useActiveWeb3React = void 0;
var core_1 = require("@web3-react/core");
var react_1 = require("react");
var react_device_detect_1 = require("react-device-detect");
var connectors_1 = require("../connectors");
var constants_1 = require("../constants");
function useActiveWeb3React() {
    var context = core_1.useWeb3React();
    var contextNetwork = core_1.useWeb3React(constants_1.NetworkContextName);
    return context.active ? context : contextNetwork;
}
exports.useActiveWeb3React = useActiveWeb3React;
function useEagerConnect() {
    var _a = core_1.useWeb3React(), activate = _a.activate, active = _a.active; // specifically using useWeb3ReactCore because of what this hook does
    var _b = react_1.useState(false), tried = _b[0], setTried = _b[1];
    react_1.useEffect(function () {
        connectors_1.injected.isAuthorized().then(function (isAuthorized) {
            if (isAuthorized) {
                activate(connectors_1.injected, undefined, true)["catch"](function () {
                    setTried(true);
                });
            }
            else {
                if (react_device_detect_1.isMobile && window.ethereum) {
                    activate(connectors_1.injected, undefined, true)["catch"](function () {
                        setTried(true);
                    });
                }
                else {
                    setTried(true);
                }
            }
        });
    }, [activate]); // intentionally only running on mount (make sure it's only mounted once :))
    // if the connection worked, wait until we get confirmation of that to flip the flag
    react_1.useEffect(function () {
        if (active) {
            setTried(true);
        }
    }, [active]);
    return tried;
}
exports.useEagerConnect = useEagerConnect;
/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
function useInactiveListener(suppress) {
    if (suppress === void 0) { suppress = false; }
    var _a = core_1.useWeb3React(), active = _a.active, error = _a.error, activate = _a.activate; // specifically using useWeb3React because of what this hook does
    react_1.useEffect(function () {
        var ethereum = window.ethereum;
        if (ethereum && ethereum.on && !active && !error && !suppress) {
            var handleChainChanged_1 = function () {
                // eat errors
                activate(connectors_1.injected, undefined, true)["catch"](function (error) {
                    console.error('Failed to activate after chain changed', error);
                });
            };
            var handleAccountsChanged_1 = function (accounts) {
                if (accounts.length > 0) {
                    // eat errors
                    activate(connectors_1.injected, undefined, true)["catch"](function (error) {
                        console.error('Failed to activate after accounts changed', error);
                    });
                }
            };
            ethereum.on('chainChanged', handleChainChanged_1);
            ethereum.on('accountsChanged', handleAccountsChanged_1);
            return function () {
                if (ethereum.removeListener) {
                    ethereum.removeListener('chainChanged', handleChainChanged_1);
                    ethereum.removeListener('accountsChanged', handleAccountsChanged_1);
                }
            };
        }
        return undefined;
    }, [active, error, suppress, activate]);
}
exports.useInactiveListener = useInactiveListener;

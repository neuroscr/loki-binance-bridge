"use strict";
exports.__esModule = true;
exports.useHasPendingApproval = exports.isTransactionRecent = exports.useIsTransactionPending = exports.useAllTransactions = exports.useTransactionAdder = void 0;
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var hooks_1 = require("../../hooks");
var actions_1 = require("./actions");
// helper that can take a ethers library transaction response and add it to the list of transactions
function useTransactionAdder() {
    var _a = hooks_1.useActiveWeb3React(), chainId = _a.chainId, account = _a.account;
    var dispatch = react_redux_1.useDispatch();
    return react_1.useCallback(function (response, _a) {
        var _b = _a === void 0 ? {} : _a, summary = _b.summary, approval = _b.approval;
        if (!account)
            return;
        if (!chainId)
            return;
        var hash = response.hash;
        if (!hash) {
            throw Error('No transaction hash found.');
        }
        dispatch(actions_1.addTransaction({ hash: hash, from: account, chainId: chainId, approval: approval, summary: summary }));
    }, [dispatch, chainId, account]);
}
exports.useTransactionAdder = useTransactionAdder;
// returns all the transactions for the current chain
function useAllTransactions() {
    var _a;
    var chainId = hooks_1.useActiveWeb3React().chainId;
    var state = react_redux_1.useSelector(function (state) { return state.transactions; });
    return chainId ? (_a = state[chainId]) !== null && _a !== void 0 ? _a : {} : {};
}
exports.useAllTransactions = useAllTransactions;
function useIsTransactionPending(transactionHash) {
    var transactions = useAllTransactions();
    if (!transactionHash || !transactions[transactionHash])
        return false;
    return !transactions[transactionHash].receipt;
}
exports.useIsTransactionPending = useIsTransactionPending;
/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
function isTransactionRecent(tx) {
    return new Date().getTime() - tx.addedTime < 86400000;
}
exports.isTransactionRecent = isTransactionRecent;
// returns whether a token has a pending approval transaction
function useHasPendingApproval(tokenAddress, spender) {
    var allTransactions = useAllTransactions();
    return react_1.useMemo(function () {
        return typeof tokenAddress === 'string' &&
            typeof spender === 'string' &&
            Object.keys(allTransactions).some(function (hash) {
                var tx = allTransactions[hash];
                if (!tx)
                    return false;
                if (tx.receipt) {
                    return false;
                }
                else {
                    var approval = tx.approval;
                    if (!approval)
                        return false;
                    return approval.spender === spender && approval.tokenAddress === tokenAddress && isTransactionRecent(tx);
                }
            });
    }, [allTransactions, spender, tokenAddress]);
}
exports.useHasPendingApproval = useHasPendingApproval;

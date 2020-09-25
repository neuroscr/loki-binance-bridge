"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.useSocksController = exports.useMulticallContract = exports.usePairContract = exports.useBytes32TokenContract = exports.useENSResolverContract = exports.useENSRegistrarContract = exports.useWETHContract = exports.useTokenContract = exports.useV1ExchangeContract = exports.useV2MigratorContract = exports.useV1FactoryContract = void 0;
var sdk_1 = require("@uniswap/sdk");
var IUniswapV2Pair_json_1 = require("@uniswap/v2-core/build/IUniswapV2Pair.json");
var react_1 = require("react");
var ens_registrar_json_1 = __importDefault(require("../constants/abis/ens-registrar.json"));
var ens_public_resolver_json_1 = __importDefault(require("../constants/abis/ens-public-resolver.json"));
var erc20_1 = require("../constants/abis/erc20");
var erc20_json_1 = __importDefault(require("../constants/abis/erc20.json"));
var migrator_1 = require("../constants/abis/migrator");
var unisocks_json_1 = __importDefault(require("../constants/abis/unisocks.json"));
var weth_json_1 = __importDefault(require("../constants/abis/weth.json"));
var multicall_1 = require("../constants/multicall");
var v1_1 = require("../constants/v1");
var utils_1 = require("../utils");
var index_1 = require("./index");
// returns null on errors
function useContract(address, ABI, withSignerIfPossible) {
    if (withSignerIfPossible === void 0) { withSignerIfPossible = true; }
    var _a = index_1.useActiveWeb3React(), library = _a.library, account = _a.account;
    return react_1.useMemo(function () {
        if (!address || !ABI || !library)
            return null;
        try {
            return utils_1.getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined);
        }
        catch (error) {
            console.error('Failed to get contract', error);
            return null;
        }
    }, [address, ABI, library, withSignerIfPossible, account]);
}
function useV1FactoryContract() {
    var chainId = index_1.useActiveWeb3React().chainId;
    return useContract(chainId && v1_1.V1_FACTORY_ADDRESSES[chainId], v1_1.V1_FACTORY_ABI, false);
}
exports.useV1FactoryContract = useV1FactoryContract;
function useV2MigratorContract() {
    return useContract(migrator_1.MIGRATOR_ADDRESS, migrator_1.MIGRATOR_ABI, true);
}
exports.useV2MigratorContract = useV2MigratorContract;
function useV1ExchangeContract(address, withSignerIfPossible) {
    return useContract(address, v1_1.V1_EXCHANGE_ABI, withSignerIfPossible);
}
exports.useV1ExchangeContract = useV1ExchangeContract;
function useTokenContract(tokenAddress, withSignerIfPossible) {
    return useContract(tokenAddress, erc20_json_1["default"], withSignerIfPossible);
}
exports.useTokenContract = useTokenContract;
function useWETHContract(withSignerIfPossible) {
    var chainId = index_1.useActiveWeb3React().chainId;
    return useContract(chainId ? sdk_1.WETH[chainId].address : undefined, weth_json_1["default"], withSignerIfPossible);
}
exports.useWETHContract = useWETHContract;
function useENSRegistrarContract(withSignerIfPossible) {
    var chainId = index_1.useActiveWeb3React().chainId;
    var address;
    if (chainId) {
        switch (chainId) {
            case sdk_1.ChainId.MAINNET:
            case sdk_1.ChainId.GÖRLI:
            case sdk_1.ChainId.ROPSTEN:
            case sdk_1.ChainId.RINKEBY:
                address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
                break;
        }
    }
    return useContract(address, ens_registrar_json_1["default"], withSignerIfPossible);
}
exports.useENSRegistrarContract = useENSRegistrarContract;
function useENSResolverContract(address, withSignerIfPossible) {
    return useContract(address, ens_public_resolver_json_1["default"], withSignerIfPossible);
}
exports.useENSResolverContract = useENSResolverContract;
function useBytes32TokenContract(tokenAddress, withSignerIfPossible) {
    return useContract(tokenAddress, erc20_1.ERC20_BYTES32_ABI, withSignerIfPossible);
}
exports.useBytes32TokenContract = useBytes32TokenContract;
function usePairContract(pairAddress, withSignerIfPossible) {
    return useContract(pairAddress, IUniswapV2Pair_json_1.abi, withSignerIfPossible);
}
exports.usePairContract = usePairContract;
function useMulticallContract() {
    var chainId = index_1.useActiveWeb3React().chainId;
    return useContract(chainId && multicall_1.MULTICALL_NETWORKS[chainId], multicall_1.MULTICALL_ABI, false);
}
exports.useMulticallContract = useMulticallContract;
function useSocksController() {
    var chainId = index_1.useActiveWeb3React().chainId;
    return useContract(chainId === sdk_1.ChainId.MAINNET ? '0x65770b5283117639760beA3F867b69b3697a91dd' : undefined, unisocks_json_1["default"], false);
}
exports.useSocksController = useSocksController;

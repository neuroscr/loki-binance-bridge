"use strict";
exports.__esModule = true;
var qs_1 = require("qs");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
function useParsedQueryString() {
    var search = react_router_dom_1.useLocation().search;
    return react_1.useMemo(function () { return (search && search.length > 1 ? qs_1.parse(search, { parseArrays: false, ignoreQueryPrefix: true }) : {}); }, [search]);
}
exports["default"] = useParsedQueryString;

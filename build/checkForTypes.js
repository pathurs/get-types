"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = require("node-fetch");
function getPackageTypes(packageName) {
    var typeName = '@' + encodeURIComponent("types/" + packageName);
    return node_fetch_1.default("http://registry.npmjs.org/" + typeName)
        .then(function (res) { return res.json(); })
        .then(function (json) { return ({
        name: "@types/" + packageName,
        version: json['dist-tags'].latest,
    }); })
        .catch(function (_) { return null; });
}
exports.getPackageTypes = getPackageTypes;

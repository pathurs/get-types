"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
exports.packageJsonPath = path.resolve(process.cwd(), './package.json');
function getDependencies() {
    var packageJson = require(exports.packageJsonPath);
    var dependencies = __assign({}, packageJson.dependencies);
    return Object.entries(dependencies)
        .map(function (_a) {
        var name = _a[0], version = _a[1];
        return ({ name: name, version: version });
    })
        .filter(function (_a) {
        var name = _a.name;
        return !name.includes('@types/');
    });
}
exports.getDependencies = getDependencies;

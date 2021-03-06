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
var node_fetch_1 = require("node-fetch");
var path = require("path");
var fs = require("fs");
// constants
exports.packageJsonPath = path.resolve(process.cwd(), './package.json');
// util functions
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
function isSetupValid() {
    if (!fs.existsSync(exports.packageJsonPath)) {
        return [false, 'package.json is missing'];
    }
    else {
        return [true, null];
    }
}
exports.isSetupValid = isSetupValid;
function getPackagesTypesInfo(packages) {
    var getTypesForAll = packages.map(function (dependency) {
        return getPackageTypes(dependency.name)
            .then(function (dependencyTypes) { return ({
            dependencyTypes: dependencyTypes,
            dependency: dependency
        }); });
    });
    return Promise.all(getTypesForAll)
        .then(function (dependenciesAndTypes) { return dependenciesAndTypes.filter(function (_) { return !!_.dependencyTypes; }); });
}
exports.getPackagesTypesInfo = getPackagesTypesInfo;
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
function sortObjectKeys(obj) {
    return Object
        .entries(obj)
        .sort(function (_a, _b) {
        var key1 = _a[0];
        var key2 = _b[0];
        if (key1 > key2) {
            return 1;
        }
        else if (key1 < key2) {
            return -1;
        }
        else {
            return 0;
        }
    })
        .reduce(function (agg, _a) {
        var key = _a[0], value = _a[1];
        return (__assign({}, agg, (_b = {}, _b[key] = value, _b)));
        var _b;
    }, {});
}
exports.sortObjectKeys = sortObjectKeys;

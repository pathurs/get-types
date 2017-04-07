"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var checkForTypes_1 = require("./checkForTypes");
function getPackagesTypesInfo(packages) {
    var getTypesForAll = packages.map(function (dependency) {
        return checkForTypes_1.getPackageTypes(dependency.name)
            .then(function (dependencyTypes) { return ({
            dependencyTypes: dependencyTypes,
            dependency: dependency
        }); });
    });
    return Promise.all(getTypesForAll)
        .then(function (libsAndTypes) { return libsAndTypes.filter(function (_) { return !!_.dependencyTypes; }); });
}
exports.getPackagesTypesInfo = getPackagesTypesInfo;

"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var util_1 = require("./util");
var chalk_1 = require("chalk");
main();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var dependencies, packageTypes, packageJson, oldDependencies, newTypeDependencies, newPackageJson;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dependencies = util_1.getDependencies();
                    return [4 /*yield*/, util_1.getPackagesTypesInfo(dependencies)];
                case 1:
                    packageTypes = _a.sent();
                    packageJson = require(util_1.packageJsonPath);
                    oldDependencies = __assign({}, packageJson.dependencies, packageJson.devDependencies);
                    newTypeDependencies = packageTypes
                        .filter(function (_) {
                        // add only not present types
                        var oldDependenciesNames = Object.keys(oldDependencies);
                        return !oldDependenciesNames.includes(_.dependencyTypes.name);
                    })
                        .map(function (_a) {
                        var dependencyTypes = _a.dependencyTypes;
                        return dependencyTypes;
                    })
                        .reduce(function (agg, _a) {
                        var name = _a.name, version = _a.version;
                        return (__assign({}, agg, (_b = {}, _b[name] = version, _b)));
                        var _b;
                    }, {});
                    newPackageJson = __assign({}, packageJson, { devDependencies: sort(__assign({}, packageJson.devDependencies, newTypeDependencies)) });
                    fs.writeFileSync(util_1.packageJsonPath, JSON.stringify(newPackageJson, null, 2));
                    console.log(chalk_1.green('package.json updated, run npm install'));
                    return [2 /*return*/];
            }
        });
    });
}
function sort(obj) {
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

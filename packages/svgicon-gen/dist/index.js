"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var svgo_1 = require("svgo");
var utils_1 = require("./utils");
var lodash_1 = require("lodash");
var svgo_2 = require("./svgo");
var path = require("path");
var svgoCache = {};
/**
 * generate svgicon object
 * @param source svg icon content
 * @param filename svg icon file absolute path
 * @param svgRootPath svg icon root path, to calc relative path
 * @param svgoConfig svgo config
 * @param idSeparator id attr separator
 */
function gen(source, filename, svgRootPath, svgoConfig, idSeparator) {
    if (idSeparator === void 0) { idSeparator = '-'; }
    return __awaiter(this, void 0, void 0, function () {
        var name, filePath, config, key, svgo, result, data, viewBox, icon;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    svgRootPath = svgRootPath || process.cwd();
                    if (!path.isAbsolute(svgRootPath)) {
                        svgRootPath = path.join(process.cwd(), svgRootPath);
                    }
                    name = path.basename(filename).split('.')[0];
                    filePath = utils_1.default.getFilePath(svgRootPath, filename);
                    config = svgo_2.default;
                    key = '';
                    if (svgoConfig) {
                        config = lodash_1.default.merge({}, svgo_2.default, svgoConfig);
                    }
                    key = JSON.stringify(config);
                    if (svgoCache[key]) {
                        svgo = svgoCache[key];
                    }
                    else {
                        svgo = new svgo_1.default(config);
                        svgoCache[key] = svgo;
                    }
                    return [4 /*yield*/, svgo.optimize(source)];
                case 1:
                    result = _a.sent();
                    data = result.data.replace(/<svg[^>]+>/gi, '').replace(/<\/svg>/gi, '');
                    viewBox = utils_1.default.getViewBox(result);
                    // add pid attr, for css
                    data = utils_1.default.addPid(data);
                    // rename fill and stroke. (It can restroe in vue-svgicon)
                    data = utils_1.default.renameStyle(data);
                    // replace element id, make sure ID is unique. fix #16
                    data = utils_1.default.changeId(data, filePath, name, idSeparator);
                    // escape single quotes
                    data = data.replace(/'/g, "\\'");
                    icon = {
                        name: "" + filePath + name,
                        data: {
                            width: result.info.width,
                            height: result.info.height,
                            viewBox: viewBox,
                            data: data,
                        },
                    };
                    return [2 /*return*/, icon];
            }
        });
    });
}
exports.default = gen;

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var fabric_chaincode_utils_1 = require("@theledger/fabric-chaincode-utils");
var Yup = require("yup");
var MyChaincode = /** @class */ (function (_super) {
    __extends(MyChaincode, _super);
    function MyChaincode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyChaincode.prototype.queryCar = function (stubHelper, args) {
        return __awaiter(this, void 0, void 0, function () {
            var verifiedArgs, car;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fabric_chaincode_utils_1.Helpers.checkArgs(args[0], Yup.object()
                            .shape({
                            key: Yup.string().required(),
                        }))];
                    case 1:
                        verifiedArgs = _a.sent();
                        return [4 /*yield*/, stubHelper.getStateAsObject(verifiedArgs.key)];
                    case 2:
                        car = _a.sent();
                        if (!car) {
                            throw new fabric_chaincode_utils_1.NotFoundError('Car does not exist');
                        }
                        return [2 /*return*/, car];
                }
            });
        });
    };
    MyChaincode.prototype.queryPrivateCar = function (stubHelper, args) {
        return __awaiter(this, void 0, void 0, function () {
            var verifiedArgs, car;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fabric_chaincode_utils_1.Helpers.checkArgs(args[0], Yup.object()
                            .shape({
                            key: Yup.string().required(),
                        }))];
                    case 1:
                        verifiedArgs = _a.sent();
                        return [4 /*yield*/, stubHelper.getStateAsObject(verifiedArgs.key, { privateCollection: 'testCollection' })];
                    case 2:
                        car = _a.sent();
                        if (!car) {
                            throw new fabric_chaincode_utils_1.NotFoundError('Car does not exist');
                        }
                        return [2 /*return*/, car];
                }
            });
        });
    };
    MyChaincode.prototype.initLedger = function (stubHelper, args) {
        return __awaiter(this, void 0, void 0, function () {
            var cars, i, car;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cars = [{
                                make: 'Toyota',
                                model: 'Prius',
                                color: 'blue',
                                owner: 'Tomoko'
                            }, {
                                make: 'Ford',
                                model: 'Mustang',
                                color: 'red',
                                owner: 'Brad'
                            }, {
                                make: 'Hyundai',
                                model: 'Tucson',
                                color: 'green',
                                owner: 'Jin Soo'
                            }, {
                                make: 'Volkswagen',
                                model: 'Passat',
                                color: 'yellow',
                                owner: 'Max'
                            }, {
                                make: 'Tesla',
                                model: 'S',
                                color: 'black',
                                owner: 'Adriana'
                            }, {
                                make: 'Peugeot',
                                model: '205',
                                color: 'purple',
                                owner: 'Michel'
                            }, {
                                make: 'Chery',
                                model: 'S22L',
                                color: 'white',
                                owner: 'Aarav'
                            }, {
                                make: 'Fiat',
                                model: 'Punto',
                                color: 'violet',
                                owner: 'Pari'
                            }, {
                                make: 'Tata',
                                model: 'Nano',
                                color: 'indigo',
                                owner: 'Valeria'
                            }, {
                                make: 'Holden',
                                model: 'Barina',
                                color: 'violet',
                                owner: 'Shotaro'
                            }];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < cars.length)) return [3 /*break*/, 4];
                        car = cars[i];
                        car.docType = 'car';
                        return [4 /*yield*/, stubHelper.putState('CAR' + i, car)];
                    case 2:
                        _a.sent();
                        this.logger.info('Added <--> ', car);
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MyChaincode.prototype.createCar = function (stubHelper, args) {
        return __awaiter(this, void 0, void 0, function () {
            var verifiedArgs, car;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fabric_chaincode_utils_1.Helpers.checkArgs(args[0], Yup.object()
                            .shape({
                            key: Yup.string().required(),
                            make: Yup.string().required(),
                            model: Yup.string().required(),
                            color: Yup.string().required(),
                            owner: Yup.string().required(),
                        }))];
                    case 1:
                        verifiedArgs = _a.sent();
                        car = {
                            docType: 'car',
                            make: verifiedArgs.make,
                            model: verifiedArgs.model,
                            color: verifiedArgs.color,
                            owner: verifiedArgs.owner
                        };
                        return [4 /*yield*/, stubHelper.putState(verifiedArgs.key, car)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MyChaincode.prototype.createPrivateCar = function (stubHelper, args) {
        return __awaiter(this, void 0, void 0, function () {
            var verifiedArgs, car;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fabric_chaincode_utils_1.Helpers.checkArgs(args[0], Yup.object()
                            .shape({
                            key: Yup.string().required(),
                            make: Yup.string().required(),
                            model: Yup.string().required(),
                            color: Yup.string().required(),
                            owner: Yup.string().required(),
                        }))];
                    case 1:
                        verifiedArgs = _a.sent();
                        car = {
                            docType: 'car',
                            make: verifiedArgs.make,
                            model: verifiedArgs.model,
                            color: verifiedArgs.color,
                            owner: verifiedArgs.owner
                        };
                        return [4 /*yield*/, stubHelper.putState(verifiedArgs.key, car, { privateCollection: 'testCollection' })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MyChaincode.prototype.queryAllCars = function (stubHelper, args) {
        return __awaiter(this, void 0, void 0, function () {
            var startKey, endKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startKey = 'CAR0';
                        endKey = 'CAR999';
                        return [4 /*yield*/, stubHelper.getStateByRangeAsList(startKey, endKey)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MyChaincode.prototype.richQueryAllCars = function (stubHelper, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, stubHelper.getQueryResultAsList({
                            selector: {
                                docType: 'car'
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MyChaincode.prototype.getCarHistory = function (stubHelper, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, stubHelper.getHistoryForKeyAsList('CAR0')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MyChaincode.prototype.changeCarOwner = function (stubHelper, args) {
        return __awaiter(this, void 0, void 0, function () {
            var verifiedArgs, car;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fabric_chaincode_utils_1.Helpers.checkArgs(args[0], Yup.object()
                            .shape({
                            key: Yup.string().required(),
                            owner: Yup.string().required(),
                        }))];
                    case 1:
                        verifiedArgs = _a.sent();
                        return [4 /*yield*/, stubHelper.getStateAsObject(verifiedArgs.key)];
                    case 2:
                        car = _a.sent();
                        car.owner = verifiedArgs.owner;
                        return [4 /*yield*/, stubHelper.putState(verifiedArgs.key, car)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return MyChaincode;
}(fabric_chaincode_utils_1.Chaincode));
exports.MyChaincode = MyChaincode;

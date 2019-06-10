"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shim = require("fabric-shim");
var MyChaincode_1 = require("./MyChaincode");
var financialTracking_1 = require("./financialTracking");
// My Chaincode is moved to seperate file for testing
shim.start(new MyChaincode_1.MyChaincode());
shim.start(new financialTracking_1.financialTracking());

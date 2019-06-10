import shim = require('fabric-shim');
import { MyChaincode} from './MyChaincode';
import { financialTracking } from './financialTracking';
// My Chaincode is moved to seperate file for testing

shim.start(new MyChaincode());
shim.start(new financialTracking());

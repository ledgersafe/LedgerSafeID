// Essential node modules
const express = require('express')
const app = express()
const port = 4000
const cors = require('cors');
const bodyParser = require('body-parser');

// Fabric node modules
let Fabric_CA_Client = require('fabric-ca-client');
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');


// Creating wallet and connection to local storage
let path = require('path');
const fs = require('fs');
let store_path = path.join(__dirname, 'hfc-key-store');
console.log(' Store path:' + store_path);
const ccpPath = path.resolve(__dirname, '..', 'network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

// Certificate Authorities Connection 
const caURL = ccp.certificateAuthorities['ca.example.com'].url;
const ca = new Fabric_CA_Client(caURL);

// Create a new file system based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new FileSystemWallet(walletPath);
console.log(`Wallet path: ${walletPath}`);
const gateway = new Gateway();

// Middleware setup
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

// Enables change of type of data passed into server
app.use(bodyParser.urlencoded({ extended: false }));


/**
  * @desc enrolls and administration user in the Hyperledger Fabric Network
  * @param string $id - the id of the admin
  * @param string $pw - the password of the admin
  * @return bool - success or failure
*/
var enrollAdmin = async function (id, pw) {
    // Initialize Wallet Path
    // Setup any other variable / directory structure that we need
    // Enroll the Admin User
    try {
        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin');
        if (adminExists) {
            console.log('An identity for the admin user "', id, '" already exists in the wallet');
            return false;
        }
        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: id, enrollmentSecret: pw });
        const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
        wallet.import(id, identity);
        console.log('Successfully enrolled admin user "', id, '" and imported it into the wallet');
        return true;
    } catch (error) {
        console.error(`Failed to enroll admin user "${id}": ${error}`);
        process.exit(1);
    }
}

// Calls function
enrollAdmin('admin','adminpw');

/**
  * @desc Registers user in the Hyperledger Fabric Network
  * @param string $username - the username of the user
  * @return string - if the returned string is not empty, an error has occurred
*/
var register = async function (username) {
    try {

        const userExists = await wallet.exists(username);
        if (userExists) {
            console.log('An identity for the user "' + username + '" already exists in the wallet');
            return ("user duplicate");
        }

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin');
        if (!adminExists) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return ("admin null");
        }

        // Create a new gateway for connecting to our peer node.
        await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });
        console.log("Connected to Gateway")

        // Get the Certificate Authority client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        console.log("CA: ", ca._name)
        const adminIdentity = gateway.getCurrentIdentity();
        console.log("Admin ID: ", adminIdentity._name)

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: username, role: 'client' }, adminIdentity);
        console.log("Secret Generated");
        const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret });
        const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
        wallet.import(username, userIdentity);
        console.log('Successfully registered and enrolled admin user "' + username + '" and imported it into the wallet');
        return ("");

    } catch (error) {
        console.error(`Failed to register user ${username}: ${error}`);
        process.exit(1);
    }
}


/**
  * @desc login functionality for a Hyperledger Fabric Network user
  * @param string $username - the username of the Hyperledger Fabric user
  * @param string $pw - the password of the admin
  * @return bool - success or failure
*/
var login = async function (username) {
    // Checks wallet to determine if a user is registered in the HF Network
    // Renders a new page if credentials check out
    console.log('Logging In...');
    try {
        const userExists = await wallet.exists(username);
        if (userExists) {
            console.log('Log in');
            let user_path = path.join('./wallet', username, username);
            console.log(user_path);
            let json = JSON.parse(fs.readFileSync(user_path, 'utf8'));
            console.log(json);
            // TODO -- Implement Password Storage for HLF 
            // if (password === json.enrollmentSecret) {
                console.log('Login Successful!');
            //     return true;
            // }
            // else {
            //     console.log('Password is Incorrect');
            //     return false;
            // }
            return true;
        }
        else {
            console.log('User does not exist');
            return false;
        }
    } catch (error) {
        console.error(`Failed to login user ${username}: ${error}`);
        process.exit(1);
    }
}

// Register endpoint
app.use('/register', function (req, res) {
    var username = req.body.username;
    // var password = req.body.password;
    register(username).then(function(result){
        if (!result) {
            res.status(200).json({ message: 'OK'});
        } else {
            res.status(200).json({ message: 'NOK', result: result });
        }
    });
});

// Enroll endpoint
app.use('/enroll', function (req, res) {
    console.log(req.body);
    var id = req.body.id;
    var pw = req.body.pw;
    enrollAdmin(id, pw).then(function(result){
        if (result) {
            res.status(200).json({ message: 'OK' });
        } else {
            res.status(200).json({ message: 'NOK' });
        }
    });
});

// Login Endpoint
app.use('/login', function (req, res) {
    var username = req.body.username;
    // var password = req.body.password;
    login(username).then(function(result){
        if (result) {
            res.status(200).json({ message: 'OK' });
        } else {
            res.status(200).json({ message: 'NOK' });
        }
    });
});


// Starts backend service
app.listen(port, () => console.log(`Express Wallet app listening on port ${port}!`))
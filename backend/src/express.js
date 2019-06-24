
const express = require('express')
const app = express()
const port = 4000
const cors = require('cors');
const bodyParser = require('body-parser');

let Fabric_CA_Client = require('fabric-ca-client');

let path = require('path');
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
let store_path = path.join(__dirname, 'hfc-key-store');
console.log(' Store path:' + store_path);
const ccpPath = path.resolve(__dirname, '..', 'network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
const caURL = ccp.certificateAuthorities['ca.example.com'].url;
const ca = new Fabric_CA_Client(caURL);
// Create a new file system based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new FileSystemWallet(walletPath);
console.log(`Wallet path: ${walletPath}`);
const gateway = new Gateway();

const userRouter = require('./routes/userRoutes.js')();

// const CDBKVS = require('fabric-client/lib/impl/CouchDBKeyValueStore.js');

// var client = Fabric_CA_Client.loadFromConfig('test/fixtures/network.yaml');

// // Set the state store
// let stateStore = await new CDBKVS({url: 'https://<USERNAME>:<PASSWORD>@<URL>', name: '<DB_NAME>'})
// client.setStateStore(stateStore);

// // Set the crypto store
// const crypto = Fabric_CA_Client.newCryptoSuite();
// let cryptoKS = Fabric_CA_Client.newCryptoKeyStore(
//     CDBKVS,
//     {
//       url: 'https://<USERNAME>:<PASSWORD>@<URL>.cloudant.com',
//       name: '<DB_NAME>'
//     }
// );
// crypto.SetCryptoKeyStore(cryptoKS);
// client.setCryptoSuite(crypto);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/user', userRouter);


//app.use(bodyParser.json());
// const server = require('./server.js');

var enrollAdmin = async function (id, pw) {
    // Initialize Wallet Path
    // Setup any other variable / directory structure that we need
    // Enroll the Admin User
    try {
        //const wallet = new FileSystemWallet(walletPath);
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

enrollAdmin('admin','adminpw');

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
        // Get the CA client object from the gateway for interacting with the CA.
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

app.use('/login', function (req, res) {
    var username = req.body.username;
    // var password = req.body.password;
    login(username).then(function(result){
        console.log("result from hyperledger login: ",result)
        if (result) {
            res.status(200).json({ message: 'OK' });
        } else {
            res.status(200).json({ message: 'NOK' });
        }
    });
});


app.listen(port, () => console.log(`Express Wallet app listening on port ${port}!`))
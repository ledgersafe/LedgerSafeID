const express = require('express');
const serverRouter = express.Router();

module.exports = function router() {
    serverRouter.route('/enroll').post((req, res) => {
        // Initialize Wallet Path
        // Setup any other variable / directory structure that we need
        // Enroll the Admin User
        try {
            //const wallet = new FileSystemWallet(walletPath);
            // Check to see if we've already enrolled the admin user.
            const adminExists = req.wallet.exists('admin').then(function () {
                if (adminExists) {
                    console.log('An identity for the admin user "admin" already exists in the wallet');
                    return;
                }
            });

            // Enroll the admin user, and import the new identity into the wallet.
            const enrollment = req.ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' }).then(function () {
                const identity = req.X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
                req.wallet.import('admin', identity);
                console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
            });

        } catch (error) {
            console.error(`Failed to enroll admin user "admin": ${error}`);
            process.exit(1);
        }

    });
    serverRouter.route('/register').post((req, res) => {
        try {
            const wal = req.wallet;
            const userExists = req.wallet.exists(req.username).then(function () {
                if (userExists) {
                    console.log('An identity for the user "' + req.username + '" already exists in the wallet');
                    return;
                }
            });


            // Check to see if we've already enrolled the admin user.
            const adminExists = req.wallet.exists('admin').then(function () {
                if (!adminExists) {
                    console.log('An identity for the admin user "admin" does not exist in the wallet');
                    console.log('Run the enrollAdmin.js application before retrying');
                    return;
                }
            });
            // Create a new gateway for connecting to our peer node.
            req.gateway.connect(req.ccp, { wal, identity: 'admin', discovery: { enabled: false } }).then(function () {
                // Get the CA client object from the gateway for interacting with the CA.
                const ca = req.gateway.getClient().getCertificateAuthority();
                const adminIdentity = req.gateway.getCurrentIdentity();
                // Register the user, enroll the user, and import the new identity into the wallet.
                const secret = ca.register({ affiliation: 'org1.department1', enrollmentID: req.username, enrollmentSecret: req.password, role: 'client' }, adminIdentity).then(function(){
                    console.log(secret);

                });
                const enrollment = ca.enroll({ enrollmentID: req.username, enrollmentSecret: req.password }).then(function(){
                    const userIdentity = req.X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
                    req.wallet.import(req.username, userIdentity);
                    console.log('Successfully registered and enrolled admin user "' + req.username + '" and imported it into the wallet');    
                });
            });

        } catch (error) {
            console.error(`Failed to register user ${req.username}: ${error}`);
            process.exit(1);
        }
    });
    serverRouter.route('/login').get((req, res) => {
        // Checks wallet to determine if a user is registered in the HF Network
        // Renders a new page if credentials check out
        console.log('Logging In...');
        try {

            const userExists = req.wallet.exists(req.username).then(function(){
                if (userExists) {
                    console.log('Log in');
                    let user_path = req.path.join('./wallet', req.username, 'nice.json');
                    console.log(user_path);
                    let json = require('./wallet/Danny/nice.json'); //(with path)
                    console.log(json);
                    if (req.password === json.enrollmentSecret) {
                        console.log('Login Successful!');
                    }
                    else {
                        console.log('Password is Incorrect');
                    }
                }
                else {
                    console.log('User does not exist');
    
    
                }
            });
        } catch (error) {
            console.error(`Failed to login user ${req.username}: ${error}`);
            process.exit(1);
        }
    });





    /*
    async function enrollAdmin() {
        // Initialize Wallet Path
        // Setup any other variable / directory structure that we need
        // Enroll the Admin User
        try {
            //const wallet = new FileSystemWallet(walletPath);
            // Check to see if we've already enrolled the admin user.
            const adminExists = await wallet.exists('admin');
            if (adminExists) {
                console.log('An identity for the admin user "admin" already exists in the wallet');
                return;
            }
    
            // Enroll the admin user, and import the new identity into the wallet.
            const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
            const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
            wallet.import('admin', identity);
            console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
    
        } catch (error) {
            console.error(`Failed to enroll admin user "admin": ${error}`);
            process.exit(1);
        }
    }
    
    async function register(username, password) {
        try {
    
            const userExists = await wallet.exists(username);
            if (userExists) {
                console.log('An identity for the user "' + username + '" already exists in the wallet');
                return;
            }
    
            // Check to see if we've already enrolled the admin user.
            const adminExists = await wallet.exists('admin');
            if (!adminExists) {
                console.log('An identity for the admin user "admin" does not exist in the wallet');
                console.log('Run the enrollAdmin.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });
    
            // Get the CA client object from the gateway for interacting with the CA.
            const ca = gateway.getClient().getCertificateAuthority();
            const adminIdentity = gateway.getCurrentIdentity();
            // Register the user, enroll the user, and import the new identity into the wallet.
            const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: username, enrollmentSecret: password, role: 'client' }, adminIdentity);
            console.log(secret);
            const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: password });
            const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
            wallet.import(username, userIdentity);
            console.log('Successfully registered and enrolled admin user "' + username + '" and imported it into the wallet');
    
        } catch (error) {
            console.error(`Failed to register user ${username}: ${error}`);
            process.exit(1);
        }
    }
    
    async function login(username, password) {
        // Checks wallet to determine if a user is registered in the HF Network
        // Renders a new page if credentials check out
        console.log('Logging In...');
        try {
    
            const userExists = await wallet.exists(username);
            if (userExists) {
                console.log('Log in');
                let user_path = path.join('./wallet', username, 'nice.json');
                console.log(user_path);
                let json = require('./wallet/Danny/nice.json'); //(with path)
                console.log(json);
                if (password === json.enrollmentSecret) {
                    console.log('Login Successful!');
                }
                else {
                    console.log('Password is Incorrect');
                }
            }
            else {
                console.log('User does not exist');
    
    
            }
        }catch (error) {
            console.error(`Failed to login user ${username}: ${error}`);
            process.exit(1);
        }
    
    }
    
    
    
    enrollAdmin();
    register('Randomperson','emiliopw');
    login('Danny','dannypw');
    */

}

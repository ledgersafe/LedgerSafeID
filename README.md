# LedgerSafeID

## LedgerSafe Identification Platform 

#### Code Structure 

##### backend
This directory contains the server-side JavaScript and network configurations for the LedgerSafe Identification Platform. 

##### frontend
This directory contains the client-side JavaScript and and React Components of the LedgerSafe Identification Platform 

##### fabric-network
This directory contains the network scripts and paramters for the Hyperledger Fabric Network of the LedgerSafe Identification Platform. 
#### Setup

##### Start the Hyperledger Fabric Network
```
cd fabric-network
./startFabric.sh
```

##### Install Frontend Node Packages
``` 
cd frontend 
npm i 
```

##### Install Backend Node Packages
```
cd backend
npm i
```

##### Start the LedgerSafe Identity Application
```
npm i
npm start
```
const mysql = require('mysql');

const config = {
  host: 'sql3.freemysqlhosting.net',
  user: 'sql3296991',
  password: 'q7G6aCpumX',
  database: 'sql3296991',
  port: 3306
};

function handleDisconnect() {
  const dbConnection = mysql.createConnection(config);
  dbConnection.connect((err) => {
    if (err) {
      console.log('Error when connecting to db:', err);
      setTimeout(handleDisconnect, 8000);
    } else {
      console.log('Connection established with MySQL DB');
    }
  });
  dbConnection.on('error', (err) => {
    console.log('Error occurred in MySQL DB connection', err);
    handleDisconnect();
  });

  return dbConnection;
}

const dbConnection = handleDisconnect();

module.exports = dbConnection;
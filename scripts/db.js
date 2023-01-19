const mysql = require('mysql');
const config = require('./config.json')
var connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    port: config.port,
    database: config.database
});
connection.connect();

module.exports = {
    connection
}



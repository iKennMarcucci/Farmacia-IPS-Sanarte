const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('LA CONEXION CON LA BD FUE DESCONECTADA.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('LA BD TIENE MUCHAS CONEXIONES');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('CONEXION A LA BD RECHAZADA');
        }
    } else if (connection) {
        connection.release();
        console.log('DB Conectada');
        return;
    }
});

pool.query = promisify(pool.query);

module.exports = pool;
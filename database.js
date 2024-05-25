var mysql=require('mysql2/promise');


var connection=mysql.createPool({
    host:'localhost',
    database:'ticketdb',
    user:'root',
    password:'12345',
    multipleStatements: true
});

//connection.query = util.promisify(connection.query);

module.exports=connection;
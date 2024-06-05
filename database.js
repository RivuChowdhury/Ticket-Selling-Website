var mysql=require('mysql2/promise');


var connection=mysql.createPool({
    host:'bommdlo3bdnlutklfvop-mysql.services.clever-cloud.com',
    database:'bommdlo3bdnlutklfvop',
    user:'ucoqy0cj3mcjvyif',
    password:'8T1uWRiCp3ZN8bOBK4Bs',
    multipleStatements: true
});

//connection.query = util.promisify(connection.query);

module.exports=connection;
let mysql = require('mysql');
let connection = mysql.createConnection({
    host:        'localhost',
    user:        'root',
    password:    'rifkhi',
    database:    'db_mh'
 });

 connection.connect(function(error){
    if(!!error){
      console.log(error);
    }else{
      console.log('Koneksi Berhasil!');
    }
  });

  module.exports = connection;
  

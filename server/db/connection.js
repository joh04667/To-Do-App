var pg = require('pg');

var connectionString;

if (process.env.DATABASE_URL){
  pg.defaults.ssl = true;
  console.log('environment var');
  connectionString = process.env.DATABASE_URL;
} else {
  console.log('local var');
  connectionString = 'postgres://localhost:5432/todo';
}

function initializeDB(){
  pg.connect(connectionString, function(err, client,done){
    console.log('connected to postgsql');
    if(err){
      console.log('Error connecting to DB!', err);
      process.exit(1);
    } else {

        var query = client.query(
          'CREATE TABLE IF NOT EXISTS tasks(' +
          'id SERIAL PRIMARY KEY,' +
          'task_name varchar(255) NOT NULL,' +
          'task_complete boolean NOT NULL)');


      query.on('end', function(){
        console.log('table created');
        done();
      });


    }
  });
}

module.exports.connectionString = connectionString;
module.exports.initializeDB = initializeDB;

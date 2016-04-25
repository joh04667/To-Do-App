var router = require('express').Router();
var path = require('path');
var pg = require('pg');

var connectionString = require('../db/connection').connectionString;


// get all tasks
router.get('/', function(request, response) {
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
      response.sendStatus(500);
    } else {
      var query = client.query('SELECT * FROM tasks');
      var results = [];
      query.on('error', function(err){
        console.log(err);
        response.sendStatus(500);
        done();
      });
      query.on('row', function(rowData){
        results.push(rowData);
      });
      query.on('end', function(){
        response.send(results);
        done();
      });
    }
  });
});


// router.post new task
router.post('/new', function(request, response){
  console.log('request get', request.body);
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
      response.sendStatus(500);
    } else {
      var result = [];
      var newTask = request.body.task_name;
      console.log(request.body);

      var query = client.query('INSERT INTO tasks (task_name, task_complete) VALUES ($1, $2)' + 'RETURNING id, task_name', [newTask, false]);

      query.on('row', function(row){
        result.push(row);
      });
      query.on('end', function() {
        done();
        response.send(result);
      });

      query.on('error', function(error) {
        console.log('error running query:', error);
        done();
        response.status(500).send(error);

      });
    }
  });
});

// complete a task
router.put('/update/:id', function(request, response) {
  console.log('Got task:', request.params.id);
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
      response.sendStatus(500);
    } else {
  var query = client.query('UPDATE tasks SET task_complete = true WHERE id =($1)', [request.params.id]);

  query.on('error', function(err){
    console.log(err);
    done();
    response.sendStatus(500);
  });

    response.send('updated');
    done();
   }
  });
 });


// delete task
router.delete('/delete/:id', function(request, response) {
  console.log('Got delete request:', request.params.id);
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
      response.sendStatus(500);
    } else {
  var query = client.query('DELETE FROM tasks WHERE id IN ($1)', [request.params.id]);
  console.log('deleting', query);

  query.on('error', function(err){
    console.log(err);
    done();
    response.sendStatus(500);
  });

    response.send('deleted');
    done();
   }
  });
 });


module.exports = router;

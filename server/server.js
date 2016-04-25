var express = require('express');
var bodyParser = require('body-parser');
var initializeDB =
require('./db/connection').initializeDB;

var app = express();
var port = process.env.PORT || 3000;

var index = require('./routes/index');
var tasks = require('./routes/tasks');

app.use(express.static('server/public'));
app.use(bodyParser.json());

///////////routes/////////////
app.use('/', index);
app.use('/tasks', tasks);

initializeDB();




//listen
app.listen(port, function() {
  console.log('listening on port', port);
});

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const routes = require('./routes/index');
const actors = require('./routes//actors');
const films = require('./routes/films');
const img = require('./routes/img/images');
const log = require('./routes/log/log');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/images', express.static(__dirname+'/public/images/actors/'))
app.use('/api/images', img);
app.use('/', routes);
app.use('/api', films);
app.use('/api/actors', actors);
app.use('/api/log', log);

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
})
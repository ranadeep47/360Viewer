var express = require('express');

var config 	= require('./config');

var app = express();

app.use(express.static(__dirname+"/public"));

app.listen(config.port,config.host);
/*
      _    ____  ____  
     / \  |  _ \|  _ \ 
    / _ \ | |_) | |_) |
   / ___ \|  __/|  __/ 
  /_/   \_\_|   |_|    
*/

'use strict'

//! Dependencias
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//! Cargar Rutas
var user_routes = require('./routes/user');
var product_routes = require('./routes/product');
var category_routes = require('./routes/category');
var currency_routes = require('./routes/currency');
// var purchase_routes = require('./routes/purchase');
var paymentmethod_routes = require('./routes/paymentmethod');

//! Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//! CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//! RUTAS
app.use('/', user_routes);
app.use('/', product_routes);
app.use('/', category_routes);
app.use('/', currency_routes);
// app.use('/', purchase_routes);
app.use('/', paymentmethod_routes);

//! Exportar
module.exports = app;
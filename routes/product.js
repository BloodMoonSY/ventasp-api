/*
   ____        _              ____                _            _            
  |  _ \ _   _| |_ __ _ ___  |  _ \ _ __ ___   __| |_   _  ___| |_ ___  ___ 
  | |_) | | | | __/ _` / __| | |_) | '__/ _ \ / _` | | | |/ __| __/ _ \/ __|
  |  _ <| |_| | || (_| \__ \ |  __/| | | (_) | (_| | |_| | (__| || (_) \__ \
  |_| \_\\__,_|\__\__,_|___/ |_|   |_|  \___/ \__,_|\__,_|\___|\__\___/|___/
*/

'use strict'

//! Dependencias
var express = require('express');
var multipart = require('connect-multiparty');

//! Controladores
var ProductController = require('../controllers/product');

//! Middleware
var md_auth = require('../middleware/authenticated');

//! Exportar rutas y ruta de imagenes
var api = express.Router();
var md_upload = multipart({ uploadDir: './uploads/products'});

//! Rutas
api.get('/ptest', md_auth.ensureAuth, ProductController.Ptest);
api.post('/addprod', md_auth.ensureAuth, ProductController.nuevoProducto);

//! Exportar Ruta
module.exports = api;
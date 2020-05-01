/*
   ____        _           ____      _                        _       
  |  _ \ _   _| |_ __ _   / ___|__ _| |_ ___  __ _  ___  _ __(_) __ _ 
  | |_) | | | | __/ _` | | |   / _` | __/ _ \/ _` |/ _ \| '__| |/ _` |
  |  _ <| |_| | || (_| | | |__| (_| | ||  __/ (_| | (_) | |  | | (_| |
  |_| \_\\__,_|\__\__,_|  \____\__,_|\__\___|\__, |\___/|_|  |_|\__,_|
                                             |___/                    
*/

'use strict'

//! Dependencias
var express = require('express');

//! Controladores
var CategoryController = require('../controllers/category');

//! Middleware
var md_auth = require('../middleware/authenticated');

//! Exportar rutas
var api = express.Router();

//! Rutas
api.get('/categorias', md_auth.ensureAuth, CategoryController.getCategries);
api.post('/categoria', md_auth.ensureAuth, CategoryController.addCategory);
api.delete('/categoria/:id', md_auth.ensureAuth, CategoryController.deleteCategory);

//! Exportar Ruta
module.exports = api;
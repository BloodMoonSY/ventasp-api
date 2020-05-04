/*
   ____        _          _____ _                   _         ____                _     _       
  |  _ \ _   _| |_ __ _  |_   _(_)_ __   ___     __| | ___   / ___|__ _ _ __ ___ | |__ (_) ___  
  | |_) | | | | __/ _` |   | | | | '_ \ / _ \   / _` |/ _ \ | |   / _` | '_ ` _ \| '_ \| |/ _ \ 
  |  _ <| |_| | || (_| |   | | | | |_) | (_) | | (_| |  __/ | |__| (_| | | | | | | |_) | | (_) |
  |_| \_\\__,_|\__\__,_|   |_| |_| .__/ \___/   \__,_|\___|  \____\__,_|_| |_| |_|_.__/|_|\___/ 
                                 |_|                                                            
*/

'use strict'

//! Dependencias
var express = require('express');

//! Controladores
var CurrencyController = require('../controllers/currency');

//! Middleware
var md_auth = require('../middleware/authenticated');

//! Exportar rutas
var api = express.Router();

//! Rutas
api.get('/currencies', md_auth.ensureAuth, CurrencyController.getCurrencies);
api.post('/currency', md_auth.ensureAuth, CurrencyController.addCurrency);
api.delete('/currency/:id', md_auth.ensureAuth, CurrencyController.deleteCurrency);

//! Exportar Ruta
module.exports = api;
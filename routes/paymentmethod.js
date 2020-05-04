/*
   ____        _          __  __      _            _             _        ____                   
  |  _ \ _   _| |_ __ _  |  \/  | ___| |_ ___   __| | ___     __| | ___  |  _ \ __ _  __ _  ___  
  | |_) | | | | __/ _` | | |\/| |/ _ \ __/ _ \ / _` |/ _ \   / _` |/ _ \ | |_) / _` |/ _` |/ _ \ 
  |  _ <| |_| | || (_| | | |  | |  __/ || (_) | (_| | (_) | | (_| |  __/ |  __/ (_| | (_| | (_) |
  |_| \_\\__,_|\__\__,_| |_|  |_|\___|\__\___/ \__,_|\___/   \__,_|\___| |_|   \__,_|\__, |\___/ 
                                                                                     |___/       
*/

'use strict'

//! Dependencias
var express = require('express');

//! Controladores
var PaymentMethodController = require('../controllers/paymentmethod');

//! Middleware
var md_auth = require('../middleware/authenticated');

//! Exportar rutas
var api = express.Router();

//! Rutas
api.get('/paymentsmethods', md_auth.ensureAuth, PaymentMethodController.getPaymentsMethods);
api.post('/paymentmethod', md_auth.ensureAuth, PaymentMethodController.addPaymentMethod);
api.delete('/paymentmethod', md_auth.ensureAuth, PaymentMethodController.deletePaymentMethod);

//! Exportar Ruta
module.exports = api;
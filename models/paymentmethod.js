/*
   __  __           _      _         __  __      _            _             _        ____                   
  |  \/  | ___   __| | ___| | ___   |  \/  | ___| |_ ___   __| | ___     __| | ___  |  _ \ __ _  __ _  ___  
  | |\/| |/ _ \ / _` |/ _ \ |/ _ \  | |\/| |/ _ \ __/ _ \ / _` |/ _ \   / _` |/ _ \ | |_) / _` |/ _` |/ _ \ 
  | |  | | (_) | (_| |  __/ | (_) | | |  | |  __/ || (_) | (_| | (_) | | (_| |  __/ |  __/ (_| | (_| | (_) |
  |_|  |_|\___/ \__,_|\___|_|\___/  |_|  |_|\___|\__\___/ \__,_|\___/   \__,_|\___| |_|   \__,_|\__, |\___/ 
                                                                                                |___/       
*/

'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaymentMethodSchema = Schema({
     name: String,
     description: String
});

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);
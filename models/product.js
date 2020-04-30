/*
   __  __           _      _         ____                _            _        
  |  \/  | ___   __| | ___| | ___   |  _ \ _ __ ___   __| |_   _  ___| |_ ___  
  | |\/| |/ _ \ / _` |/ _ \ |/ _ \  | |_) | '__/ _ \ / _` | | | |/ __| __/ _ \ 
  | |  | | (_) | (_| |  __/ | (_) | |  __/| | | (_) | (_| | |_| | (__| || (_) |
  |_|  |_|\___/ \__,_|\___|_|\___/  |_|   |_|  \___/ \__,_|\__,_|\___|\__\___/ 
*/

'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = Schema({
     name: String,
     file: String,
     created_at: String,
     price: Number,
     description: String,
     discount: Number,
     stock: Number,
     characteristic: String,
     another_characteristic: String,
     user: {type: Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Product', ProductSchema);
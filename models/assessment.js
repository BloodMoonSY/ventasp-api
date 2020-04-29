/*
    Modelo de
  __     __    _                      _             
  \ \   / /_ _| | ___  _ __ __ _  ___(_) ___  _ __  
   \ \ / / _` | |/ _ \| '__/ _` |/ __| |/ _ \| '_ \ 
    \ V / (_| | | (_) | | | (_| | (__| | (_) | | | |
     \_/ \__,_|_|\___/|_|  \__,_|\___|_|\___/|_| |_|
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
     rating: Number,
     seller: {type: Schema.ObjectId, ref: 'User'},
     client: {type: Schema.ObjectId, ref: 'User'},
     product: {type: Schema.ObjectId, ref: 'Product'}
});

module.exports = mongoose.model('Product', ProductSchema);
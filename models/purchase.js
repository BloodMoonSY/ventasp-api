/*
   __  __           _      _          ____                                
  |  \/  | ___   __| | ___| | ___    / ___|___  _ __ ___  _ __  _ __ __ _ 
  | |\/| |/ _ \ / _` |/ _ \ |/ _ \  | |   / _ \| '_ ` _ \| '_ \| '__/ _` |
  | |  | | (_) | (_| |  __/ | (_) | | |__| (_) | | | | | | |_) | | | (_| |
  |_|  |_|\___/ \__,_|\___|_|\___/   \____\___/|_| |_| |_| .__/|_|  \__,_|
                                                         |_|              
*/

'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PurchaseSchema = Schema({
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

module.exports = mongoose.model('Product', PurchaseSchema);
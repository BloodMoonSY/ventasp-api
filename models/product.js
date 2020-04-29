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
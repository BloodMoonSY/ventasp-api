'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    surname: String,
    nick: String,
    email: String,
    password: String,
    phone: String,
    role: String,
    image: String,
    country: String,
    address: String,
    zipcode: Number
});

module.exports = mongoose.model('User', UserSchema);
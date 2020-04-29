/*
    Modelo de
   _   _                      _       
  | | | |___ _   _  __ _ _ __(_) ___  
  | | | / __| | | |/ _` | '__| |/ _ \ 
  | |_| \__ \ |_| | (_| | |  | | (_) |
   \___/|___/\__,_|\__,_|_|  |_|\___/ 
                                      
 
*/

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
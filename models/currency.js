/*
   __  __           _      _         _____ _                   _         ____                _     _       
  |  \/  | ___   __| | ___| | ___   |_   _(_)_ __   ___     __| | ___   / ___|__ _ _ __ ___ | |__ (_) ___  
  | |\/| |/ _ \ / _` |/ _ \ |/ _ \    | | | | '_ \ / _ \   / _` |/ _ \ | |   / _` | '_ ` _ \| '_ \| |/ _ \ 
  | |  | | (_) | (_| |  __/ | (_) |   | | | | |_) | (_) | | (_| |  __/ | |__| (_| | | | | | | |_) | | (_) |
  |_|  |_|\___/ \__,_|\___|_|\___/    |_| |_| .__/ \___/   \__,_|\___|  \____\__,_|_| |_| |_|_.__/|_|\___/ 
                                            |_|                                                            
*/

'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CurrencySchema = Schema({
     name: String
});

module.exports = mongoose.model('Currency', CurrencySchema);
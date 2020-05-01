/*
   __  __           _      _          ____      _                        __      
  |  \/  | ___   __| | ___| | ___    / ___|__ _| |_ ___  __ _  ___  _ __/_/ __ _ 
  | |\/| |/ _ \ / _` |/ _ \ |/ _ \  | |   / _` | __/ _ \/ _` |/ _ \| '__| |/ _` |
  | |  | | (_) | (_| |  __/ | (_) | | |__| (_| | ||  __/ (_| | (_) | |  | | (_| |
  |_|  |_|\___/ \__,_|\___|_|\___/   \____\__,_|\__\___|\__, |\___/|_|  |_|\__,_|
                                                        |___/                    
*/

'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = Schema({
     name: String
});

module.exports = mongoose.model('Category', CategorySchema);
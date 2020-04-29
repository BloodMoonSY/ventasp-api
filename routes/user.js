/*
 
   ____        _              _   _                      _       
  |  _ \ _   _| |_ __ _ ___  | | | |___ _   _  __ _ _ __(_) ___  
  | |_) | | | | __/ _` / __| | | | / __| | | |/ _` | '__| |/ _ \ 
  |  _ <| |_| | || (_| \__ \ | |_| \__ \ |_| | (_| | |  | | (_) |
  |_| \_\\__,_|\__\__,_|___/  \___/|___/\__,_|\__,_|_|  |_|\___/ 
                                                                 
 
*/

'use strict'

// ** Dependencias
var express = require('express');
var multipart = require('connect-multiparty');

// ** Controladores
var UserController = require('../controllers/user');

// ** Middleware
var md_auth = require('../middleware/authenticated');

var api = express.Router();
var md_upload = multipart({ uploadDir: './uploads/users'});

api.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFiles);
api.delete('/user/:id', UserController.deleteUser);

module.exports = api;
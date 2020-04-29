/*
    ____            _             _           _                  _        _   _                      _           
   / ___|___  _ __ | |_ _ __ ___ | | __ _  __| | ___  _ __    __| | ___  | | | |___ _   _  __ _ _ __(_) ___  ___ 
  | |   / _ \| '_ \| __| '__/ _ \| |/ _` |/ _` |/ _ \| '__|  / _` |/ _ \ | | | / __| | | |/ _` | '__| |/ _ \/ __|
  | |__| (_) | | | | |_| | | (_) | | (_| | (_| | (_) | |    | (_| |  __/ | |_| \__ \ |_| | (_| | |  | | (_) \__ \
   \____\___/|_| |_|\__|_|  \___/|_|\__,_|\__,_|\___/|_|     \__,_|\___|  \___/|___/\__,_|\__,_|_|  |_|\___/|___/
*/

'use strict'

//! Dependencias
var bcrypt = require('bcrypt-nodejs');
var mongoosePeginate = require('mongoose-pagination');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

//? Modelos
var User = require('../models/user');


/*
 _  _ ____ ___ ____ ___  ____ ____    ___  ____ _       ____ ___  _ 
 |\/| |___  |  |  | |  \ |  | [__     |  \ |___ |       |__| |__] | 
 |  | |___  |  |__| |__/ |__| ___]    |__/ |___ |___    |  | |    | 
*/

/**
*!   Metodo de Prueba
*TODO: Hacer prueba del controlador
 */
function pruebas (req, res){
    res.status(200).send({message: 'Accion de pruebas en el servidor de NodeJS'});
}

/**
*!   Metodo Guardar Usuario
*TODO: Registro de usuario en Front-End
*@param params Trae todos los campos que lleno el usuario en el formulario
 */
function saveUser (req, res){

    var params = req.body;
    var user = new User();

    if(params.name && params.surname && params.nick && params.email && params.password && params.phone && params.country && params.address && params.zipcode){

        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.phone = params.phone;
        user.country = params.country;
        user.address = params.address;
        user.zipcode = params.zipcode;
        user.role = params.role;
        user.image = null;

        User.find({ $or: [
                            //** Validamos que no existan en la base de datos
                            {email: user.email.toLowerCase()},
                            {nick: user.nick.toLowerCase()},
                            {phone: user.phone.toLowerCase()}

                    ]}).exec((err, users)=>{

                        if(err) return res.status(500).send({message: 'Error en la peticion de usuarios'});

                        if(users && users.length >= 1){
                            return res.status(200).send({message: 'El usuario que intentas registar ya existe'});
                        }else{
                             //Cifra la contraseña y guarda los datos
                            bcrypt.hash(params.password, null, null, (err, hash) =>{
                                user.password = hash;

                                user.save((err, userStored) =>{

                                    if(err) return res.status(500).send({message: 'Error al guardar el usuario'});

                                    if(userStored){
                                        console.log(params);
                                        res.status(200).send({user: userStored});
                                    }else{
                                        res.status(404).send({message: 'No se ha registrado el usuario'});
                                    }

                                });
                            });
                        }
                    });
    }else{
        //! Capturamos el error
        console.log(params);
        res.status(200).send({message: 'Rellena todos los campos necesarios!!'});
    }
}

/**
*!   Metodo de Login del Usuario
*TODO: Login de usuario en Front-End
*@param params Usamos los campos para iniciar sesion
 */
function loginUser (req, res){ 
    var params = req.body;
    
    var email = params.email;
    var password = params.password;

    User.findOne({email: email}, (err, user) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if(user){
            bcrypt.compare(password, user.password, (err, check) => {
                if(check){
                    //Devolver datos de usuario
                    if(params.gettoken){
                        return res.status(200).send({
                            token:jwt.createToken(user)
                        });
                    }else{
                        //Devolver datos de usuario
                        user.password = undefined;
                        return res.status(200).send({user});
                    }
                }else{
                    return res.status(404).send({message: 'El usuario no se ha podido identificar2'});
                }
            });
        }else{
            return res.status(404).send({message: 'El usuario no se ha podido identificar!!1'});
        }
    });
}

// function getUser (req, res){
//     var userId = req.params.id;

//     User.findById(userId, (err, user) =>{
//         if(err) return res.status(500).send({message: 'Error en la peticion'});
//         if(!user) return res.status(404).send({message: 'El usuario no existe'});

//        followThisUser(req.user.sub ,userId).then((value) =>{
//            user.password = undefined;
//             return res.status(200).send({
//                 user,
//                 following: value.following,
//                 followed: value.followed
//             });
//        });
//     });
// }

// //Funcion asincrona
// async function followThisUser (identity_user_id, user_id){
//     var following = await Follow.findOne({"user":identity_user_id, "followed":user_id}).exec((err, follow) =>{
//         if(err) return handleError(err);
//         return follow;
//     });
//     var followed = await Follow.findOne({"user":user_id, "followed":identity_user_id}).exec((err, follow) =>{
//         if(err) return handleError(err);
//         return follow;
//     });
//     return {
//         following: following,
//         followed: followed
//     }
// }

// function getUsers(req, res){
//     var identity_user_id = req.user.sub;
//     var page = 1;
//     var itemsPerPage = 5;

//     if(req.params.page){
//         page = req.params.page;
//     }

//     User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
//         if(err) return res.status(500).send({message: 'Error en la peticion'});
//         if(!users) return res.status(404).send({message: 'No hay usuarios disponibles'});

//         followUserIds(identity_user_id).then((value)=>{
//             return res.status(200).send({
//                 users,
//                 users_following: value.following,
//                 users_follow_me: value.followed,
//                 total,
//                 pages: Math.ceil(total/itemsPerPage)
//             });
//         });
//     });
// }

// async function followUserIds (userId){
//     var following = await Follow.find({"user": userId}).select({'_id':0, '__v':0, 'user':0}).exec((err, follows) => {
//         return follows;
//     });
//     var followed = await Follow.find({"followed": userId}).select({'_id':0, '__v':0, 'followed':0}).exec((err, follows) =>{
//         return follows;
//     });

//     var following_clean =[];

//     following.forEach((follow)=>{
//         following_clean.push(follow.followed);
//     });

//     //Procesar followed ids
//     var followed_clean = [];
//     followed.forEach((follow) =>{
//         followed_clean.push(follow.user);
//     });

//     return {
//         following: following_clean,
//         followed: followed_clean
//     }
// }

// function updateUser (req, res){
//     var userId = req.params.id;
//     var update = req.body;
//     delete update.password;

//     if(userId != req.user.sub){
//         return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'});
//     }

//     User.find({ $or: [
//         {email: update.email.toLowerCase()},
//         {nick: update.nick.toLowerCase()}
//     ]}).exec((err, users) => {

//         var user_isset = false;

//         users.forEach((user)=>{
//             if(user && user._id != userId) user_isset = true;
//         });

//         if(user_isset) return res.status(404).send({message: 'Los datos ya estan en uso'});

//         User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated) => {

//             if(err) return res.status(500).send({message: 'Erro en la peticion'});
    
//             if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
    
//             return res.status(200).send({user: userUpdated});
//         });
//     });

    
// }

// function uploadImage (req, res){
//     var userId = req.params.id;

//     if(userId != req.user.sub){
//         return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'});
//     }

//     if(req.files){
//         var file_path = req.files.image.path;
//         console.log(file_path);

//         var file_split = file_path.split('\\')
//         console.log(file_split);

//         var file_name = file_split[2];
//         console.log(file_name);

//         var ext_split = file_name.split('\.');
//         var file_ext = ext_split[1];

//         if(userId != req.user.sub){
//             return removeFilesOfUpdates(res, file_path, 'No tienes permiso para actualizar los datos del usuario');
//         }
    
//         if(file_ext == 'png' || file_ext == 'PNG' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
//             User.findByIdAndUpdate(userId, {image: file_name}, {new: true}, (err, userUpdated) => {
//                 if(err) return res.status(500).send({message: 'Error en la peticion'});
//                 if(!userUpdated) return res.status(404).send({message: 'No se ha podido realizar la peticion'});
    
//                 return res.status(200).send({user: userUpdated});
//             });
//         }else{
//             return removeFilesOfUpdates(res, file_path, 'Extension no valida');
//         }
//     }else{
//         return res.status(200).send({message: 'No se han subido imagenes'});
//     }
// }

// function removeFilesOfUpdates (res, file_path, message){
//     fs.unlink(file_path, (err) =>{
//         return res.status(200).send({message: message});
//     });
// }

// function getImageFiles (req, res){
//     var image_file = req.params.imageFile;
//     var path_file = './uploads/users/' + image_file;

//     fs.exists(path_file, (exists) => {
//         if(exists){
//             res.sendFile(path.resolve(path_file));
//         }else{
//             res.status(200).send({message: 'No existe la imagen'});
//         }
//     });
// }

// function deleteUser (req, res){
//     var userId = req.params.id;

//     //Buscamos por ID, eliminamos el objeto y devolvemos el objeto borrado en un JSON
//     User.findByIdAndRemove(userId, (err, userRemoved) =>{

//         if(err) return res.status(500).send({message: 'Error en la peticion'});
//         if(!userRemoved) return res.status(404).send({message: 'No se ha podido borrar el usuario porque no existe'});

//         return res.status(200).send({user: userRemoved});

//     });
// }

// function getCounters (req, res){
//     var userId = req.user.sub;
//     if(req.params.id){
//         userId = req.params.id;
//     }
//     getCountFollow(userId).then((value) =>{
//         return res.status(200).send(value);
//     });

// }

// async function getCountFollow (user_id){
//     var following = await Follow.count({"user":user_id}).exec((err, count)=>{
//         if(err) return handleError(err);
//         return count;
//     });
//     var followed = await Follow.count({"followed":user_id}).exec((err, count)=>{
//         if(err) return handleError(err);
//         return count;
//     });
//     var publications = await Publication.count({"user":user_id}).exec((err, count) =>{
//         if(err) return handleError(err);
//         return count;
//     });

//     return {
//         following: following,
//         followed: followed,
//         publications: publications
//     }
// }

module.exports = {
    pruebas,
    saveUser,
    loginUser
    // getUser,
    // getUsers,
    // updateUser,
    // uploadImage,
    // getImageFiles,
    // deleteUser,
    // getCounters
}
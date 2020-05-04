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
*?  Metodo de Prueba
** Hacer prueba del controlador
 */
function pruebas (req, res){
    res.status(200).send({message: 'Accion de pruebas en el servidor de NodeJS'});
}

/**
*?  Metodo Guardar Usuario
** Registro de usuario en Front-End
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
        user.role = "USER";
        user.image = "null";

        User.find({ $or: [
                            //** Validamos que no existan en la base de datos
                            {email: user.email.toLowerCase()},
                            {nick: user.nick.toLowerCase()},
                            {phone: user.phone.toLowerCase()}

                    ]}).exec((err, users)=>{

                        if(err) return res.status(500).send({message: 'Error en la peticion de usuarios', users});

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
*?  Metodo de Login del Usuario
**m params Usamos los campos para iniciar sesion
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

                    //* Devolver token del usuario
                    if(params.gettoken){
                        return res.status(200).send({
                            token:jwt.createToken(user)
                        });
                    }else{
                        //* Devolver datos de usuario y quitar contraseña
                        user.password = undefined;
                        return res.status(200).send({user});
                    }
                }else{
                    return res.status(404).send({message: 'La contraseña es incorrecta'});
                }
            });
        }else{
            return res.status(404).send({message: 'El correo electronico no existe'});
        }
    });
}

/**
*?  Metodo de Login del Usuario
**  Obtenemos todos los campos de un usuario especifico
 */
function getUser (req, res){
    //* Obetenemos el id del usuario
    var userId = req.params.id;

    //* Validamos que el ID del usuario exista
    User.findById(userId, (err, user) =>{
        if(err) return res.status(500).send({message: 'Error en la peticion'});//?  Error del servidor capturado
        if(!user) return res.status(404).send({message: 'El usuario no existe'});//!    Error al validar que el ID no existe

        //* Retornamos todos los campos del usuario
        //* El campo de contraseña no lo retornamos por motivos de seguridad
        user.password = undefined;
        
        return res.status(200).send({user: user});
        
    });
}

/**
*?  Metodo de Mostrar todos los Usuarios
**  Obtenemos todos los usuarios y todos sus campos(menos contraseña)
 */
function getUsers(req, res){
    //* Obtenemos el usuario logueado
    var identity_user_id = req.user.sub;

    //* Definimos pagina de inicio
    var page = 1;
    var itemsPerPage = 5;

    //* Asignamos la pagina segun el request.
    if(req.params.page){
        page = req.params.page;
    }

    //* Hacemos una consulta con todos los campos segun su ID, los paginamos y definimos un total.
    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {

        //! Capturamos errores de servidor y no hay usuarios
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!users) return res.status(404).send({message: 'No hay usuarios disponibles'});

        //* Mostramos resultado, paginas y total de paginas.
        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total/itemsPerPage)
        });
    });
}

/**
*?  Metodo para Actualizar datos de un Usuario
**  Hacemos que pueda actualizar sus datos
 */
function updateUser (req, res){
    //* Capturamos los campos del usuario con su ID
    var userId = req.params.id;
    var update = req.body;

    //* Hacemos que se elimine contraseña para que vuelva a ingresar una nueva
    delete update.password;

    //* Validamos que sea el mismo usuario el que actualize sus propios datos
    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'});
    }

    //* Buscamos por medio de correo y nick, ya que estos datos son unicos
    User.find({ $or: [
        {email: update.email.toLowerCase()},
        {nick: update.nick.toLowerCase()},
        {phone: update.phone.toLowerCase()}
    ]}).exec((err, users) => {

        //! Capturamos errores
        if(err) return res.status(500).send({message: 'Error en el servidor'});

        var user_isset = false;

        //* Validamos que los datos no esten repetidos en ningun otro usuario o ingrese los mismos
        users.forEach((user)=>{
            if(user && user._id != userId) user_isset = true;
        });

        if(user_isset) return res.status(404).send({message: 'Los datos ya estan en uso'});

        //* Actualizamos todos los datos segun el ID del usuario
        User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated) => {

            //! Capturamos los errores
            if(err) return res.status(500).send({message: 'Erro en la peticion'});
    
            if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
            
            //* Resultado correcto actualiza la colleccion
            return res.status(200).send({user: userUpdated});
        });
    });
}

/**
*?  Metodo para Agregar Imagen a un usuario(actualiza el campo imagen)
**  Insertar imagen a un usuario
 */
function uploadImage (req, res){
    //* Obtenemos el ID del usuario
    var userId = req.params.id;

    //* Validamos que sea el usuario logueado el que realice esta accion
    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'});
    }

    //* Validamos que venga un archivo en la peticion
    if(req.files){

        //* Obtenemos la ruta de la imagen
        var file_path = req.files.image.path;

        //* Separa los '\' de la ruta
        var file_split = file_path.split('\\')

        //* Obtenemos el nombre del archivo
        var file_name = file_split[2];

        //* Separamos la extencion del archivo
        var ext_split = file_name.split('\.');

        //* Obtenemos la extencion del archivo
        var file_ext = ext_split[1];

        //! Validacion que alguien intente actualizar pero no tiene el token correcto
        if(userId != req.user.sub){
            return removeFilesOfUpdates(res, file_path, 'No tienes permiso para actualizar los datos del usuario');
        }
    
        //* Decimos que solo permita las siguientes extensiones
        if(file_ext == 'png' || file_ext == 'PNG' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){

            //* Actualizamos el campo de imagen
            User.findByIdAndUpdate(userId, {image: file_name}, {new: true}, (err, userUpdated) => {

                //! Capturamos los errores
                if(err) return res.status(500).send({message: 'Error en la peticion'});
                if(!userUpdated) return res.status(404).send({message: 'No se ha podido realizar la peticion'});
    
                //* Operacion correcta
                return res.status(200).send({user: userUpdated});
            });
        }else{
            //! Error de extension
            return removeFilesOfUpdates(res, file_path, 'Extension no valida');
        }
    }else{
        //! El campo viene vacio
        return res.status(200).send({message: 'No se han subido imagenes'});
    }
}

/**
*?  Metodo para Quitar la imagen de un usuario
**  Quitamos la imagen de un usuario
 */
function removeFilesOfUpdates (res, file_path, message){
    /**
**  Parametros del metodo
    @param file_path :Este parametro requiere una ruta
    @param message :Muestra un mensaje
     **/ 

    //* Quitamos la ruta de nuestro proyecto    
    fs.unlink(file_path, (err) =>{
        return res.status(200).send({message: message});
    });
}

/**
*?  Metodo para Mostrar la imagen de un usuario
**  Obtenemos la imagen de un usuario y la mostramos
 */
function getImageFiles (req, res){
    //* Obtenemos el archivo de la imagen
    var image_file = req.params.imageFile;
    var path_file = './uploads/users/' + image_file;

    //* Validamos que exista el archivo con su ruta
    fs.exists(path_file, (exists) => {
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la imagen'});
        }
    });
}

/**
*?  Metodo para Eliminar un Usuario(metodo de desarrollo)
**  Hacemos que pueda actualizar sus datos
 */
function deleteUser (req, res){
    //* Obtenemos el ID del usuario
    var userId = req.params.id;

     //Buscamos por ID, eliminamos el objeto y devolvemos el objeto borrado en un JSON
    User.findByIdAndRemove(userId, (err, userRemoved) =>{

        //! Capturamos los errores
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!userRemoved) return res.status(404).send({message: 'No se ha podido borrar el usuario porque no existe'});

        //* Operacion correcta
        return res.status(200).send({user: userRemoved});

    });
}

//?   Exportamos los metodos para usarlos en cualquier parte
module.exports = {
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFiles,
    deleteUser
}
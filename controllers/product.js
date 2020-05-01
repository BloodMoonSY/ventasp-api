/*
   __  __           _      _         ____                _            _            
  |  \/  | ___   __| | ___| | ___   |  _ \ _ __ ___   __| |_   _  ___| |_ ___  ___ 
  | |\/| |/ _ \ / _` |/ _ \ |/ _ \  | |_) | '__/ _ \ / _` | | | |/ __| __/ _ \/ __|
  | |  | | (_) | (_| |  __/ | (_) | |  __/| | | (_) | (_| | |_| | (__| || (_) \__ \
  |_|  |_|\___/ \__,_|\___|_|\___/  |_|   |_|  \___/ \__,_|\__,_|\___|\__\___/|___/
*/

'use strict'

//! Dependencias
var bcrypt = require('bcrypt-nodejs');
var mongoosePeginate = require('mongoose-pagination');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

//! Modelos
let User = require('../models/user');
let Product = require('../models/product');


/*
 _  _ ____ ___ ____ ___  ____ ____ 
 |\/| |___  |  |  | |  \ |  | [__  
 |  | |___  |  |__| |__/ |__| ___] 
*/


//? Metodo de Prueba
//TODO: Probar que funcione controlador
function Ptest(req, res){
    res.status(200).send({message: 'Controlador de Productos funcionando'});
}

//? Metodo para agregar producto
//TODO: Guardar el producto en la base de datos
function nuevoProducto(req, res) {

    //* Guardamos los datos de los campos en una variable
    var params = req.body;

    //* Validamos todos los campos
    if(params.name && params.price &&  params.description &&  params.discount &&  params.stock &&  params.characteristic &&  params.another_characteristic){

        //* Instanciamos el modelo
        var producto = new Product();

        //* Emparejamos datos del formulario con los del modelo
        producto.name = params.name;
        producto.price = params.price;
        producto.description = params.description;
        producto.discount = params.discount;
        producto.stock = params.stock;
        producto.characteristic = params.characteristic;
        producto.another_characteristic = params.another_characteristic;
        producto.user = req.user.sub;
        producto.created_at = moment().unix();
        producto.file = 'null';

        //* Guardamos el Producto
        producto.save((err, productStored)=>{

            //! Capturamos errores
            if(err) return res.status(500).send({message: 'Error en el servidor', productStored});
            if(!productStored) return res.status(404).send({message: 'El producto no se ha guardado'});

            //* Guardamos el producto
            return res.status(200).send({producto: productStored});

        });
    }else{

        //* Hay campos vacios
        return  res.status(200).send({message: 'Hay campos vacios', params});
        console.log('parametros: ', params);
    }
}

//? Metodo para mostrar todos los productos
//TODO: Mostrar productos sin filtros
function getProducts(req, res){

    //* Establecemos que la pagina empiece en 1
    var page = 1;

    //* Asignamos el numero de pagina
    if(req.params.page){
        page = req.params.page;
    }

    //* Establecemos el limite de paginas por vista
    var itemsPerPage = 4;


        Product.find({}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, products, total)=>{

        //! Capturamos los errores
        if(err) return res.status(500).send({message: 'Error en el servidor'});
        if(!products) return res.status(404).send({message: 'No hay productos disponibles'});

        //* Cuando si existen productos
        return res.status(200).send({

            total_items: total,
            pages: Math.ceil(total/itemsPerPage),
            page: page,
            items_per_page: itemsPerPage,
            products

        });
    });
}

//? Mis productos
//TODO: Metodo permite listar nuestros productos
function getMyProducts(req, res){

    //* Obtenemos nuestro ID
    var userId = req.user.sub;

    //* Iniciamos consulta pasandole nuestro ID
    var find = Product.find({user: userId});

    //* Filtramos la busqueda donde el usuario seamos nosotros
    find.populate('user').exec((err, productos) => {

        //! Capturamos los errores
        if(err) return res.status(500).send({message: 'Error en el servidor'});
        if(!productos) return res.status(404).send({message: 'No tienes productos'});

        //* Mostrar nuestros productos
        return res.status(200).send({productos});

    });
}

//? Metodo para eliminar un publicacion
//TODO: Metodo require del ID de la publicacion para eliminarla
function deleteProduct (req, res){

    //* Obtenermos el ID de la publicacion
    var productId = req.params.id;

    //* Validamos que el ID sea del Usuario
    Product.find({'user':req.user.sub,'_id':productId}).remove(err =>{

        //! Capturamos los errores
        if(err) return res.status(500).send({message: 'Error al borrar el producto'});

        //* Funcion correcta
        return res.status(200).send({message: 'Producto eliminado correctamente'});
    });
}

//? Actualizar producto
//TODO: Metodo para actualizar campos del producto
function updateProduct(req, res){

    //* Obtenemos el ID de quien esta logueado
    var userId = req.params.id;

    //* Obtenemos el ID del producto
    var productId = req.params.id;

    //* Pasamos los datos que queremos actualizar
    var update = req.body;

    //* Realizamos la busqueda del producto a modificar
    Product.findOne({_id: productId},{'__v': 0}).exec((err, product)=>{

        //* Actualizamos los campos que mandamos
        Product.findByIdAndUpdate(productId, update, {new: true}, (err, productUpdated)=>{

            //! Capturamos errores
            if(err) return res.status(500).send({message: 'Erro en la peticion'});
            if(!productUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
    
            //* Operacion completada
            return res.status(200).send({product: productUpdated});

        });
    });
}

//? Metodo subir imagen
//TODO: Subir imagen de publicacion
function uploadImage (req, res){

    //* Obtenemos el ID del producto
    var productId = req.params.id;

    //* Obtenemos quien esta logueado
    var userId = req.user.sub;

    //* Validamos que exista el archivo
    if(req.files){

        //* Obtenemos la ruta
        var file_path = req.files.file.path;

        //* Separamos los campos de la ruta
        var file_split = file_path.split('\\')

        //* Obtenemos el nombre y la extension
        var file_name = file_split[2];

        //* Separamos el nombre y extension
        var ext_split = file_name.split('\.');

        //* Obtenemos el nombre del archivo
        var file_ext = ext_split[1];

        //* Validamos que el producto sea del usuario
        if(userId != req.user.sub){
            return removeFilesOfUpdates(res, file_path, 'No tienes permiso para actualizar la imagen del producto');
        }
    
        //* Validamos la extension del archivo
        if(file_ext == 'png' || file_ext == 'PNG' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){

            //* Actualizamos a la nueva imagen del producto
            Product.findByIdAndUpdate(productId, {file: file_name}, {new: true}, (err, productUpdated) => {

                //! Capturamos los errores
                if(err) return res.status(500).send({message: 'Error en la peticion'});
                if(!productUpdated) return res.status(404).send({message: 'No se ha podido realizar la peticion'});
    
                //* Operacion correcta
                return res.status(200).send({product: productUpdated});
            });
        }else{

            //! Error la extension no valida
            return removeFilesOfUpdates(res, file_path, 'Extension no valida');
        }
    }else{

        //! Error no se subio la imagen
        return res.status(200).send({message: 'No se han subido imagenes'});
    }
}

//? Meotodo para quitar imagen
//TODO: Quitar imagen temporal para subir otra
function removeFilesOfUpdates (res, file_path, message){
    fs.unlink(file_path, (err) =>{
        return res.status(200).send({message: message});
    });
}

//? Mostrar imagen de producto
//TODO: Mostrar imagen del producto
function getImageFiles (req, res){

    //* Obtenemos el archivo
    var image_file = req.params.imageFile;

    //* Obtenemos la ruta de la imagen
    var path_file = './uploads/products/' + image_file;

    //* Validamos que exista la ruta
    fs.exists(path_file, (exists) => {

        if(exists){

            //* Si existe
            res.sendFile(path.resolve(path_file));
        }else{

            //! Error que no encontro la imagen
            res.status(200).send({message: 'No existe la imagen'});
        }
    });
}

//! Exportamos los metodos para usarlos en cualquier parte
module.exports = {
    Ptest,
    nuevoProducto,
    getProducts,
    getMyProducts,
    deleteProduct,
    updateProduct,
    uploadImage,
    removeFilesOfUpdates,
    getImageFiles
}
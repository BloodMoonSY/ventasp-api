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


//!   Exportamos los metodos para usarlos en cualquier parte
module.exports = {
    Ptest,
    nuevoProducto
}
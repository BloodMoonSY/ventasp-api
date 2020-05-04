/*
    ____            _             _           _              __  __      _            _             _        ____                   
   / ___|___  _ __ | |_ _ __ ___ | | __ _  __| | ___  _ __  |  \/  | ___| |_ ___   __| | ___     __| | ___  |  _ \ __ _  __ _  ___  
  | |   / _ \| '_ \| __| '__/ _ \| |/ _` |/ _` |/ _ \| '__| | |\/| |/ _ \ __/ _ \ / _` |/ _ \   / _` |/ _ \ | |_) / _` |/ _` |/ _ \ 
  | |__| (_) | | | | |_| | | (_) | | (_| | (_| | (_) | |    | |  | |  __/ || (_) | (_| | (_) | | (_| |  __/ |  __/ (_| | (_| | (_) |
   \____\___/|_| |_|\__|_|  \___/|_|\__,_|\__,_|\___/|_|    |_|  |_|\___|\__\___/ \__,_|\___/   \__,_|\___| |_|   \__,_|\__, |\___/ 
                                                                                                                        |___/       
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
var PaymentMethod = require('../models/paymentmethod'); //? Modelo Metodo de Pago
var Currency = require('../models/currency');   //? Modelo Tipo de cambio
var PaymentMethod = require('../models/paymentmethod'); //? Modelo Metodo de Pago
var User = require('../models/user');   //? Modelo Usuario
var Product = require('../models/product'); //? Modelo Producto

/*
 _  _ ____ ___ ____ ___  ____ ____ 
 |\/| |___  |  |  | |  \ |  | [__  
 |  | |___  |  |__| |__/ |__| ___]                    
*/

//? Metodo Agregar Metodo de Pago
//TODO: Metodo para agregar un nuevo metodo de pago
function addPaymentMethod(req, res){

    //* Guardamos los datos de los campos en una variable
    var params = req.body;

    //* Instanciamos nuestros modelo
    var paymentmethod = new PaymentMethod();

    //* Validamos que venga el campo lleno
    if(params.name && params.description){

        //* Emparejamos datos del formulario con los del modelo
        paymentmethod.name = params.name;
        paymentmethod.description = params.description;

        //* Verificamos repetidos
        PaymentMethod.find({ $or: [

            {name: paymentmethod.name},
            {description: paymentmethod.description}

            ]}).exec((err, existe)=>{

            //! Capturamos los errores
            if(err) return res.status(500).send({message: 'Error en el servidor'});

            //* Validacion que exista
            if(existe && existe.length >= 1){

                //* No existen los datos
                //! Ya existe metodo de pago
                return res.status(200).send({message: 'El metodo de pago que intentas registar ya existe'});

            }else{
                
                paymentmethod.save((err, paymentmethodStored)=>{

                    //! Capturamos los errores
                    if(err) return res.status(500).send({message: 'Error en el servidor'});
                    
                    if(paymentmethodStored){

                        //* Guardamos la categoria
                        return res.status(200).send({paymentmethod: paymentmethodStored});

                    }else{

                        //! No se ha podido agregar
                        return res.status(404).send({message: 'No se ha podido guardar el metodo de pago'});
                    }
                });
            }
        });
    }else{
        //! Error al no llenar el campo
        return res.status(200).send({message: 'Favor de llenar los campos requeridos'});
    }
}

//? Metodo para listar todos los metodos de pago
//TODO: Metodo para listar todos los metodos de pago
function getPaymentsMethods(req, res){

    PaymentMethod.find({}, {__v: 0}).exec((err, paymentmethodSearched)=>{

        //! Capturamos los errores
        if(err) return res.status(500).send({message: 'Error en el servidor'});
        if(!paymentmethodSearched) return res.status(404).send({message: 'No se ha encontrado metodos de pagos'})
        if(paymentmethodSearched.length == 0) return res.status(200).send({message: 'No hay metodos de pago'});

        //* Si existen metods de pago
        return res.status(200).send({paymentmethod});

    });
}

//? Metodo para eliminar un metodo de pago
//TODO: Metodo require del ID del metodo de pago
function deletePaymentMethod(req, res){

    //* Obtenemos el ID del tipo de cambio
    var paymentmethodId = req.params.id;

    //Buscamos por ID, eliminamos el objeto y devolvemos el objeto borrado en un JSON
    PaymentMethod.findByIdAndRemove(paymentmethodId, (err, paymentmethodRemoved) =>{

        //! Capturamos los errores
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!paymentmethodRemoved) return res.status(404).send({message: 'No se ha podido borrar el metodo de pago porque no existe'});

        //* Elemento eliminado
        return res.status(200).send({currency: paymentmethodRemoved});

    });
}

//! Exportamos los metodos para usarlos en cualquier parte
module.exports = {
    addPaymentMethod,
    getPaymentsMethods,
    deletePaymentMethod
}
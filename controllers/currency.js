/*
    ____            _             _           _              _____ _                   _         ____                _     _       
   / ___|___  _ __ | |_ _ __ ___ | | __ _  __| | ___  _ __  |_   _(_)_ __   ___     __| | ___   / ___|__ _ _ __ ___ | |__ (_) ___  
  | |   / _ \| '_ \| __| '__/ _ \| |/ _` |/ _` |/ _ \| '__|   | | | | '_ \ / _ \   / _` |/ _ \ | |   / _` | '_ ` _ \| '_ \| |/ _ \ 
  | |__| (_) | | | | |_| | | (_) | | (_| | (_| | (_) | |      | | | | |_) | (_) | | (_| |  __/ | |__| (_| | | | | | | |_) | | (_) |
   \____\___/|_| |_|\__|_|  \___/|_|\__,_|\__,_|\___/|_|      |_| |_| .__/ \___/   \__,_|\___|  \____\__,_|_| |_| |_|_.__/|_|\___/ 
                                                                    |_|                                                            
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
var Currency = require('../models/currency');


/*
 _  _ ____ ___ ____ ___  ____ ____ 
 |\/| |___  |  |  | |  \ |  | [__  
 |  | |___  |  |__| |__/ |__| ___] 
*/

//? Metodo Agregar Tipo de Cambio
//TODO: Agregar nuevo tipo de cambio
function addCurrency(req, res){

    //* Guardamos los datos de los campos en una variable
    var params = req.body;

    //* Instanciamos nuestros modelo
    var currency = new Currency();

    //* Validamos que venga el campo lleno
    if(params.name){

        //* Emparejamos datos del formulario con los del modelo
        currency.name = params.name;

        //* Verificamos repetidos
        Currency.find({ $or: [

            {name: currency.name}

            ]}).exec((err, existe)=>{

            //! Capturamos los errores
            if(err) return res.status(500).send({message: 'Error en el servidor'});

            //* Validacion que exista
            if(existe && existe.length >= 1){

                //* No existen los datos
                //! Ya existe tipo de cambio
                return res.status(200).send({message: 'El tipo de cambio que intentas registar ya existe'});

            }else{
                
                currency.save((err, currencyStored)=>{

                    //! Capturamos los errores
                    if(err) return res.status(500).send({message: 'Error en el servidor'});
                    
                    if(currencyStored){

                        //* Guardamos la categoria
                        return res.status(200).send({currency: currencyStored});

                    }else{

                        //! No se ha podido agregar
                        return res.status(404).send({message: 'No se ha podido guardar el tipo de cambio'});
                    }
                });
            }
        });
    }else{
        //! Error al no llenar el campo
        return res.status(200).send({message: 'Favor de llenar los campos requeridos'});
    }
}

//? Metodo para eliminar un tipo de cambio
//TODO: Metodo require del ID del tipo de cambio para eliminarla
function deleteCurrency(req, res){

    //* Obtenemos el ID del tipo de cambio
    var currencyId = req.params.id;

    //Buscamos por ID, eliminamos el objeto y devolvemos el objeto borrado en un JSON
    Currency.findByIdAndRemove(currencyId, (err, currencyRemoved) =>{

        //! Capturamos los errores
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!currencyRemoved) return res.status(404).send({message: 'No se ha podido borrar la categoria porque no existe'});

        //* Elemento eliminado
        return res.status(200).send({currency: currencyRemoved});

    });
}

//? Metodo listar Tipos de Cambio
//TODO: Lista todos los tipos de cambio sin filtro
function getCurrencies(req, res){

    //* Buscamos todos los tipos de cambio que existan
    Currency.find({}, {__v: 0}).exec((err, currencySearched)=>{

        //! Capturamos los errores
        if(err) return res.status(500).send({message: 'Error en el servidor'});
        if(!currencySearched) return res.status(404).send({message: 'No existen tipos de cambio'});
        if(currencySearched.length < 1) return res.status(200).send({message: 'No hay tipos de cambio'});

        //* Cuando existen categorias disponibles
        return res.status(200).send({currencySearched});

    });

}

//! Exportamos los metodos para usarlos en cualquier parte
module.exports = {
    addCurrency,
    deleteCurrency,
    getCurrencies
}
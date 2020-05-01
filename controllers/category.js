/*
    ____            _             _           _               ____      _                        __      
   / ___|___  _ __ | |_ _ __ ___ | | __ _  __| | ___  _ __   / ___|__ _| |_ ___  __ _  ___  _ __/_/ __ _ 
  | |   / _ \| '_ \| __| '__/ _ \| |/ _` |/ _` |/ _ \| '__| | |   / _` | __/ _ \/ _` |/ _ \| '__| |/ _` |
  | |__| (_) | | | | |_| | | (_) | | (_| | (_| | (_) | |    | |__| (_| | ||  __/ (_| | (_) | |  | | (_| |
   \____\___/|_| |_|\__|_|  \___/|_|\__,_|\__,_|\___/|_|     \____\__,_|\__\___|\__, |\___/|_|  |_|\__,_|
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
var Category = require('../models/category');


/*
 _  _ ____ ___ ____ ___  ____ ____ 
 |\/| |___  |  |  | |  \ |  | [__  
 |  | |___  |  |__| |__/ |__| ___] 
*/

//? Metodo Agregar Categoria
//TODO: Agregar nueva categoria
function addCategory(req, res){

    //* Guardamos los datos de los campos en una variable
    var params = req.body;

    //* Instanciamos nuestros modelo
    var category = new Category();

    //* Validamos que venga el campo lleno
    if(params.name){

        //* Emparejamos datos del formulario con los del modelo
        category.name = params.name;

        //* Verificamos repetidos
        Category.find({ $or: [

            {name: category.name}

            ]}).exec((err, existe)=>{

            //! Capturamos los errores
            if(err) return res.status(500).send({message: 'Error en el servidor'});

            //* Validacion que exista
            if(existe && existe.length >= 1){

                //* No existen los datos
                //! Ya existe categoria
                return res.status(200).send({message: 'La categoria que intentas registar ya existe'});

            }else{
                
                category.save((err, categoryStored)=>{

                    //! Capturamos los errores
                    if(err) return res.status(500).send({message: 'Error en el servidor'});
                    
                    if(categoryStored){

                        //* Guardamos la categoria
                        return res.status(200).send({category: categoryStored});

                    }else{

                        //! No se ha podido agregar
                        return res.status(404).send({message: 'No se ha podido guardar la categoria'});
                    }
                });
            }
        });
    }else{
        //! Error al no llenar el campo
        return res.status(200).send({message: 'Favor de llenar los campos requeridos'});
    }
}

//? Metodo para eliminar un categoria
//TODO: Metodo require del ID de la categoria para eliminarla
function deleteCategory(req, res){
    var categoryId = req.params.id;

    //Buscamos por ID, eliminamos el objeto y devolvemos el objeto borrado en un JSON
    Category.findByIdAndRemove(categoryId, (err, categoryRemoved) =>{

        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!categoryRemoved) return res.status(404).send({message: 'No se ha podido borrar la categoria porque no existe'});

        return res.status(200).send({category: categoryRemoved});

    });
}

//? Metodo listar Categorias
//TODO: Lista todas las categorias sin filtro
function getCategries(req, res){

    //* Buscamos todas las categorias que existan
    Category.find({}, {__v: 0}).exec((err, categorySearched)=>{

        //! Capturamos los errores
        if(err) return res.status(500).send({message: 'Error en el servidor'});
        if(!categorySearched) return res.status(404).send({message: 'No existen categorias'});
        if(categorySearched.length < 1) return res.status(200).send({message: 'No hay categorias'});

        //* Cuando existen categorias disponibles
        return res.status(200).send({categorySearched});

    });

}

//! Exportamos los metodos para usarlos en cualquier parte
module.exports = {
    addCategory,
    deleteCategory,
    getCategries
}
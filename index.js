'use sctrict'

var mongoose = require('mongoose');
var app = require('./app');
var port = (process.env.PORT || 3900);

mongoose.Promise = global.Promise;

//! Conexion DB
//? De forma remota
//mongoose.connect('mongodb://sa:123@social-shard-00-00-2tepv.mongodb.net:27017,social-shard-00-01-2tepv.mongodb.net:27017,social-shard-00-02-2tepv.mongodb.net:27017/test?ssl=true&replicaSet=social-shard-0&authSource=admin&retryWrites=true&w=majority', {useMongoClient: true})

//? Local de forma tradicional
mongoose.connect('mongodb://localhost:27017/ventasp', {useUnifiedTopology: true, useNewUrlParser: true})

// //? Local con autentificacion
// mongoose.connect('mongodb://@localhost:27017/ventasp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log("Conection successfully");

        //Crear servidor
        app.listen(port, () =>{
            console.log("Server run on http://localhost:" + port);
        });

    })
    .catch(err => console.log(err));

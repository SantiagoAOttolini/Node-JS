const express = require('express')
const cors = require('cors');
const { dbConection } = require('../database/config');
class Server {

    constructor() {
        this.app = express()

        this.path = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            usuarios: '/api/usuarios',
            productos: '/api/productos',
            categorias: '/api/categorias'
        }

        //Conectar a la bd
        this.conectarDB()
        
        // Funcion que se va a ejecutar siempre que levantemos al servidor
        this.middlewares();
        this.routes();
        this.port = process.env.PORT;
    }

    async conectarDB() {
        await dbConection();
    }

    middlewares() {
        this.app.use(cors())
        //parseo del body a json
        this.app.use(express.json())
        //directorio publico
        this.app.use(express.static('public'))
    }

    routes() {
        this.app.use(this.path.usuarios, require('../routes/user'))
        this.app.use(this.path.auth, require('../routes/auth'))
        this.app.use(this.path.categorias, require('../routes/categorias'))
        this.app.use(this.path.productos, require('../routes/productos'))
        this.app.use(this.path.buscar, require('../routes/buscar'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        })
    }
}

module.exports = Server;
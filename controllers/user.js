const { response } = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

const obtenerUsuario = async(req, res = response) => {
    //Se le pasan los datos como query params
    //http://localhost:8080/api/usuarios?name=santi&lastname=ottolini&age=22
    // const { name = 'No name', lastname, age, page = '1' } = req.query

    //PAGINACION
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    //Primise.all va a ejecutar ambas promesas de manera simultanea
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])
    
    res.json({ 
        total,
        usuarios
    });
};

const modificarUsuario = async(req, res) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...user } = req.body;

    if(password) {
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate(id, user);
    res.json(usuario)
};

const crearUsuario = async(req, res) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    // Encriptar password
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt)

    await usuario.save();

    res.json({usuario});
}

const patchUser = (req, res) => {
    res.json({
        msg: 'patch API'
    })
}

const borrarUsuario = async(req, res) => {
    const { id } = req.params;
    //const usuario = await Usuario.findByIdAndDelete(id);
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})

    res.json(usuario)
}

module.exports = {
    obtenerUsuario,
    modificarUsuario,
    borrarUsuario,
    patchUser,
    crearUsuario,
}
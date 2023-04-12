const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')

const validarJWT = async(req, res, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(400).json({
            msg: 'No hay tokens en la peticion'
        });
    }

    try {
        //Verifica el JWT
        const { uuid } = jwt.verify(token, process.env.SECRETOPRIVATEKEY);

        const usuario = await Usuario.findById(uuid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe en DB'
            })
        }

        //Verificar que el estado del usuario este en true (existe el usuario) y no que este eliminado
        if (!usuario.estado) {
            res.status(401).json({
                msg: 'Token no valido - usuario con estado: false'
            })
        }
        req.usuario = usuario;

        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token no valido'
        });
    }
}

module.exports = {
    validarJWT
}
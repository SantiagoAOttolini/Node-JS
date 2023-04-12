const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res) => {
    const { correo, password } = req.body;
    try {

        //Verificar usuario existente
        const usuario = await Usuario.findOne({correo})

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - correo'
            })
        }

        //Verificar que el usuario este activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - estado: false'
            })
        }

        //Compara contraseña
        const contraseñaValida = bcryptjs.compareSync(password, usuario.password)

        if (!contraseñaValida) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - password'
            })
        }

        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const googleSignIn = async(req, res) => {
    const { id_token } = req.body

    try {
        const { nombre, img, correo } = await googleVerify(id_token)

        let usuario = await Usuario.findOne({ correo })

        if (!usuario) {
            //Crear usuario
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            }

            usuario = new Usuario(data)
            await usuario.save()
        }

        // Si el usuario en DB 
        if (!usuario.estado) {
            res.status(401).json({
                msg: 'Hable con el administrador o el usuario bloqueado'
            })
        }

        const token = await generarJWT(usuario.id)



        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            msg: 'El token no se pudo verificar'
        })
    }
}

module.exports = {
    login,
    googleSignIn
}
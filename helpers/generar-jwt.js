const jwt = require('jsonwebtoken')

const generarJWT = (uuid = '') => {
    return new Promise((resolve, reject) => {
         const payload = { uuid }
         jwt.sign(payload, process.env.SECRETOPRIVATEKEY, {
            expiresIn: '4h'
         }, (err, token) => {
            if (err) {
                console.log("🚀 ~ err", err)
                reject('No se pudo generar el token')
            } else {
                resolve(token)
            }
         })
    })
}

module.exports = {
    generarJWT
}
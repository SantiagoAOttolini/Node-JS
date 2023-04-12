const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema ({
    nombre: {
        type: String,
        require: true
    },
    correo: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        require: true,
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

//Se remueven __v y el password de la respuesta de la creacion del usuario (Se almacena pero no se ve en postman)

UsuarioSchema.methods.toJSON = function() {
    const {__v, password, _id, ...user} = this.toObject();
    user.uuid = _id;
    return user;
}

module.exports = model('Usuario', UsuarioSchema);

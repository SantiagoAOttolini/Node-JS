const { Schema, model } = require('mongoose')

const CategoriaSchemad = Schema({
    nombre: {
        type: String,
        require: true,
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref:'Usuario',
        required: true
    },
})

CategoriaSchemad.methods.toJSON = function() {
    const {__v, estado, ...categoria} = this.toObject();
    return categoria;
}

module.exports = model('Categoria', CategoriaSchemad)
const { Schema, model } = require('mongoose')

const RolSchemad = Schema({
    role: {
        type: String,
        require: true,
    }
})

module.exports = model('roles', RolSchemad)
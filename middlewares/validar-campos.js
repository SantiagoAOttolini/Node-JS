const { validationResult } = require("express-validator");

//next se llama si el middleware pasa, osea si pasa el primer if, sigue con el otro bloque de codigo

const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json(errors)
    }
    next();
}

module.exports = {
    validarCampos
}
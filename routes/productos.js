const { Router } = require('express');
const { check } = require('express-validator');
const { 
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto, 
    borrarProducto} = require('../controllers/productos');

const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');
const { validarJWT, esAdminRole } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos')


const router = Router();

//Publico
router.get('/', obtenerProductos)

//Publico
router.get('/:id', [
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], obtenerProducto)

//Privado - Cualquier persona con un token valido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es requerido para crear una categoria').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto)

//Privado - Cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto)

//Privado - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo').isMongoId(),
    validarCampos,
    check('id').custom(existeProductoPorId),
],
borrarProducto)

module.exports = router;
const { Router } = require('express');
const { check } = require('express-validator');
const { 
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria, 
    borrarCategoria} = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, esAdminRole } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos')


const router = Router();

//Publico
router.get('/', obtenerCategorias)

//Publico
router.get('/:id', [
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
], obtenerCategoria)

//Privado - Cualquier persona con un token valido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es requerido para crear una categoria').not().isEmpty(),
    validarCampos
], crearCategoria)

//Privado - Cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria)

//Privado - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo').isMongoId(),
    validarCampos,
    check('id').custom(existeCategoriaPorId),
],
borrarCategoria)

module.exports = router;
const { Router } = require('express');
const { check } = require('express-validator')

const { validarCampos, validarJWT, tieneRole, esAdminRole } = require('../middlewares')

const { esRolValido, existeEmail, existeUsuarioPorId } = require('../helpers/db-validators')

const { 
    obtenerUsuario,
    modificarUsuario,
    patchUser, 
    borrarUsuario,
    crearUsuario
} = require('../controllers/user');

const router = Router();

router.get('/', obtenerUsuario)

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom( esRolValido ),
    validarCampos,
], modificarUsuario)

router.post('/',[
    //Validaciones al crear un usuario
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y debe tener mas de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( existeEmail ),
    check('rol').custom( esRolValido ),
    validarCampos
], crearUsuario)

router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROL','USER_ROL'),
    check('id', 'No es un ID valido').isMongoId(),
    validarCampos
], borrarUsuario)

router.patch('/', patchUser)

module.exports = router;
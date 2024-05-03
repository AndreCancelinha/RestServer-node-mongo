
const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
 } = require('../middlewares');

const { usuariosGET,
    usuariosPUT,
    usuariosPOST,
    usuariosDELETE,
    usuariosPATCH } = require('../controllers/usr-control');

const { esRoleValido, esCorreoValido, existeUsuarioPorId } = require('../helpers/db-validators');

const router = Router();

router.get('/', usuariosGET);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPUT);

router.post('/', [ 
    check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
    check('password', 'El password debe ser más de 6 letras.').isLength({ min: 6 }),
    check('correo', 'hola').custom(esCorreoValido),
    // check('rol', 'No es un rol válido').isIn([ 'ADMIN_ROL', 'USER_ROL']),
    check('rol').custom(esRoleValido),
    validarCampos,
], usuariosPOST);

router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROL', 'VENTAS_ROL'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDELETE);

router.patch('/', usuariosPATCH);



module.exports = router;    
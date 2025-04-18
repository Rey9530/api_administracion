
const expres = require("express");
const router = expres.Router();
const { check } = require("express-validator");
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { actualizarUsuario, crearUsuario, eliminarUsuarios, getUsuarios, getUsuario, getRoles } = require('../controllers/usuarios');

  

router.get('/',validarJWT,getUsuarios);
router.get('/obtener/roles',validarJWT,getRoles);
router.get('/:id',validarJWT,getUsuario);
router.post('/',
    [
        validarJWT,
        check('usuario','El usuario es obligatorio').not().isEmpty(),
        check('nombres','El nombre es obligatorio').not().isEmpty(),
        check('apellidos','El apellido es obligatorio').not().isEmpty(), 
        check('id_rol','El id_rol es obligatorio').isNumeric(), 
        check('id_sucursal','El id_sucursal es obligatorio').isNumeric(), 
        validarCampos,
    ]
,crearUsuario);
router.put('/:id',
    [
        validarJWT,
        check('usuario','El usuario es obligatorio').not().isEmpty(),
        check('nombres','El nombre es obligatorio').not().isEmpty(),
        check('apellidos','El apellido es obligatorio').not().isEmpty(), 
        check('id_rol','El id_rol es obligatorio').isNumeric(), 
        check('id_sucursal','El id_sucursal es obligatorio').isNumeric(), 
        validarCampos,
    ]
,actualizarUsuario);

router.delete( '/:id' , validarJWT,eliminarUsuarios );

module.exports = router;
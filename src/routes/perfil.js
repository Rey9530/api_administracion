
const expres = require("express");
const router = expres.Router();
const { check } = require("express-validator");
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { actualizarClaveUsuario, actualizarUsuario, getUsuario } = require('../controllers/perfil');


router.get('/', validarJWT, getUsuario);
router.put('/',
    [
        validarJWT, 
        check('nombres', 'El nombre es obligatorio').not().isEmpty(),
        check('apellidos', 'El apellido es obligatorio').not().isEmpty(), 
        validarCampos,
    ]
    , actualizarUsuario);
router.put('/actualizar_clave/',
    [
        validarJWT, 
        check('clave_actual', 'El nombre es obligatorio').not().isEmpty(),
        check('clave_nueva', 'El nombre es obligatorio').not().isEmpty(),
        check('clave_confirmada', 'El apellido es obligatorio').not().isEmpty(), 
        validarCampos,
    ]
    , actualizarClaveUsuario);


    module.exports = router;
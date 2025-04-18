const expres = require("express");
const { check } = require("express-validator");
const { login, loginRenew } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt'); 
 
const router = expres.Router();


router.post('/sign-in',[
    check('usuario','El usuario es obligatorio').not().isEmpty(),
    check('password','El password es obligatorio').not().isEmpty(),
    validarCampos
] ,login ); 
router.post('/sign-in-with-token', validarJWT ,loginRenew ); 
module.exports = router;
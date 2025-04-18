const expres = require("express");
const router = expres.Router();
// import { check } from "express-validator"; 
// import { validarCampos } from '../middlewares/validar-campos'; 
// import { validarJWT } from '../middlewares/validar-jwt'; 
const { getData, } = require('../controllers/utils_');
 

router.get('/',getData); 

module.exports = router;
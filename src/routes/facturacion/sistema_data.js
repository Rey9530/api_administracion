const expres = require("express");
const router = expres.Router();
const { check } = require("express-validator");
const { getDatosSistema, updateDatosSistema } = require("../../controllers/facturacion/sistema_data");
const { validarCampos, validar_dato } = require("../../middlewares/validar-campos");
const { validarJWT } = require("../../middlewares/validar-jwt");


router.get("/", validarJWT, getDatosSistema);  

router.put(
    "/:id",
    [
      validarJWT,  
      check("nombre_sistema", "El nombre es requerido").not().isEmpty(),  
      check('impuesto','El impuesto es requerido').custom( (e) => validar_dato(e,"positivo_decimal")),
      validarCampos,
    ],
    updateDatosSistema
  );
 

module.exports = router;

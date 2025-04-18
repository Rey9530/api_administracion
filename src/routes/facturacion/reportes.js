const expres = require("express");
const router = expres.Router();
const { check } = require("express-validator");
const { getConsumidorFinal, getCreditoFiscal } = require("../../controllers/facturacion/reportes");
const { validarCampos, validar_dato } = require("../../middlewares/validar-campos");
const { validarJWT } = require("../../middlewares/validar-jwt");
router.get(
  "/consumidor_final",
  [
    validarJWT, 
    check("mes", "El tipo de factura es requerido").custom((e) => validar_dato(e, "positivo") ),
    check("anio", "El tipo de factura es requerido").custom((e) => validar_dato(e, "positivo") ),
    validarCampos,
  ],
  getConsumidorFinal
);
router.get(
  "/credito_fiscal",
  [
    validarJWT, 
    check("desde", "El tipo de factura es requerido").isDate(),
    check("hasta", "El tipo de factura es requerido").isDate(),
    validarCampos,
  ],
  getCreditoFiscal
); 
module.exports = router;

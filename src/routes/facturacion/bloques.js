
const expres = require("express");
const router = expres.Router();
const { check } = require("express-validator");
const { validarCampos, validar_dato } = require("../../middlewares/validar-campos");
const { validarJWT } = require("../../middlewares/validar-jwt");
const {
  getRegistros,
  getRegistro,
  crearRegistro,
  actualizarRegistro,
  eliminarRegistro,
  getTiposFactura,
} = require("../../controllers/facturacion/bloques");

router.get("/", validarJWT, getRegistros);
router.get("/:id", validarJWT, getRegistro);
router.post(
  "/",
  [
    validarJWT,
    check("autorizacion", "El campo serie es obligatorio").not().isEmpty(),
    check("tira", "La tira es obligatoria").not().isEmpty(),
    check("serie", "El campo serie es obligatorio").not().isEmpty(),
    check("desde", "El campo desde es obligatorio").custom( (e) => validar_dato(e,"positivo_0")),
    check("hasta", "El campo hasta es obligatorio").custom( (e) => validar_dato(e,"positivo_0")),
    check("actual", "El campo actual es obligatorio").custom( (e) => validar_dato(e,"positivo_0")),
    check('id_tipo_factura','El precio sin iva es requerido').custom( (e) => validar_dato(e,"positivo_0")),
    validarCampos,
  ],
  crearRegistro
); 
router.put(
  "/:id",
  [
    validarJWT,
    check("autorizacion", "El campo serie es obligatorio").not().isEmpty(),
    check("tira", "La tira es obligatoria").not().isEmpty(),
    check("serie", "El campo serie es obligatorio").not().isEmpty(),
    check("desde", "El campo desde es obligatorio").custom( (e) => validar_dato(e,"positivo_0")),
    check("hasta", "El campo hasta es obligatorio").custom( (e) => validar_dato(e,"positivo_0")),
    check("actual", "El campo actual es obligatorio").custom( (e) => validar_dato(e,"positivo_0")),
    check('id_tipo_factura','El precio sin iva es requerido').custom( (e) => validar_dato(e,"positivo_0")),
    validarCampos,
  ],
  actualizarRegistro
);

router.get("/factura/tipos", validarJWT, getTiposFactura);

router.delete("/:id", validarJWT, eliminarRegistro);

module.exports = router;

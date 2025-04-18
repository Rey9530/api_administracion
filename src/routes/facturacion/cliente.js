
const expres = require("express");
const router = expres.Router();
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");
const { validarJWT } = require("../../middlewares/validar-jwt");
const {
  getRegistros,
  getRegistro,
  crearRegistro,
  actualizarRegistro,
  eliminarRegistro,
  getFacturas,
  obntenerTiposContribuyentes,
} = require("../../controllers/facturacion/cliente");
const fileUpload = require("express-fileupload");

router.use(fileUpload()); 
router.get("/", validarJWT, getRegistros);
router.get("/:id", validarJWT, getRegistro);
router.get("/facturas/:id", validarJWT, getFacturas);
router.post(
  "/",
  [
    validarJWT,
    check('nombre','El nombre es requerido').not().isEmpty(),
    check('telefono','El nombre es requerido').not().isEmpty(),
    check('direccion','El nombre es requerido').not().isEmpty(),
    validarCampos,
  ],
  crearRegistro
);
router.put(
  "/:id",
  [
    validarJWT,
    check('nombre','El nombre es requerido').not().isEmpty(),
    check('telefono','El nombre es requerido').not().isEmpty(),
    check('direccion','El nombre es requerido').not().isEmpty(), 
    validarCampos,
  ],
  actualizarRegistro
);

router.delete("/:id", validarJWT, eliminarRegistro);


router.get("/obtener/tipos/contribuyentes", validarJWT, obntenerTiposContribuyentes);

module.exports = router;

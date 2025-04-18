
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
} = require("../../controllers/facturacion/catalogo_tipo");

router.get("/", validarJWT, getRegistros);
router.get("/:id", validarJWT, getRegistro);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearRegistro
);
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarRegistro
);

router.delete("/:id", validarJWT, eliminarRegistro);

module.exports = router;


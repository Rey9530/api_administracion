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
  getTiposDescuentos,
  getRegistrosActivos,
} = require("../../controllers/facturacion/decuentos");

router.get("/", validarJWT, getRegistros);
router.get("/:id", validarJWT, getRegistro);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El campo serie es obligatorio").not().isEmpty(),
    check("porcentaje", "El campo desde es obligatorio").custom((e) =>
      validar_dato(e, "positivo_0")
    ),
    validarCampos,
  ],
  crearRegistro
);
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El campo serie es obligatorio").not().isEmpty(),
    check("porcentaje", "El campo desde es obligatorio").custom((e) =>
      validar_dato(e, "positivo_0")
    ),
    validarCampos,
  ],
  actualizarRegistro
);

router.get("/listar/tipos", validarJWT, getTiposDescuentos);
router.get("/listar/activos", validarJWT, getRegistrosActivos);

router.delete("/:id", validarJWT, eliminarRegistro);

module.exports = router;

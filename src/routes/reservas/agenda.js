
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
  actualizarEstadoRegistro,
  getRegistrosFiltrados,
} = require("../../controllers/reservas/agenda");

router.get("/", validarJWT, getRegistros);
router.get("/:id_sucursal",
  [
    validarJWT,
    check(
      "desde",
      "El parametro desde es requerido y debe ser formato fecha YYYY-mm-dd"
    )
      .not()
      .isEmpty()
      .isDate(),
    check(
      "hasta",
      "El parametro hasta es requerido y debe ser formato fecha YYYY-mm-dd"
    )
      .not()
      .isEmpty()
      .isDate(),
    validarCampos,
  ], getRegistrosFiltrados);
router.get("/:id", validarJWT, getRegistro);
router.post(
  "/",
  [
    validarJWT,
    check("id_sucursal", "La sucursal es obligatoria").not().isEmpty(),
    check("zona", "La zona es obligatoria").not().isEmpty(),
    check("no_personas", "El numero de personas es obligatorio")
      .not()
      .isEmpty(),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("telefono", "El telefono es obligatorio").not().isEmpty(),
    check("date", "La fecha es obligatoria").not().isEmpty(),
    check("start", "El hora es obligatoria").not().isEmpty(),
    check("turno", "El hora es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  crearRegistro
);
router.put(
  "/:id",
  [
    validarJWT,
    check("id_sucursal", "La sucursal es obligatoria").not().isEmpty(),
    check("zona", "La zona es obligatoria").not().isEmpty(),
    check("no_personas", "El numero de personas es obligatorio")
      .not()
      .isEmpty(),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("telefono", "El telefono es obligatorio").not().isEmpty(),
    check("date", "La fecha es obligatoria").not().isEmpty(),
    check("start", "El hora es obligatoria").not().isEmpty(),
    check("turno", "El hora es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarRegistro
);
router.put(
  "/cambiar_estado/:id",
  [
    validarJWT,
    check("estado", "El estado es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarEstadoRegistro
);

router.delete("/:id", validarJWT, eliminarRegistro);

module.exports = router;

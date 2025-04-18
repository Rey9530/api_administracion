
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
  updateAsPrinicpal,
} = require("../../controllers/inventario/bodegas");

router.get("/", validarJWT, getRegistros);
router.get("/:id", validarJWT, getRegistro);
router.get("/asignar_principal/:id", validarJWT, updateAsPrinicpal);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(), 
    check("id_sucursal", "La sucursal es requerida").custom((e) =>
      validar_dato(e, "positivo")
    ),
    validarCampos,
  ],
  crearRegistro
);
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(), 
    check("id_sucursal", "La sucursal es requerida").custom((e) =>
      validar_dato(e, "positivo")
    ),
    validarCampos,
  ],
  actualizarRegistro
);

router.delete("/:id", validarJWT, eliminarRegistro);

module.exports = router;

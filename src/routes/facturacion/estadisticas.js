const expres = require("express");
const router = expres.Router();
const { check } = require("express-validator");
const {
  getDataTablero,
  getPieDataProveedores,
  getPiePorcentajePropinas,
  getVentasMensuales,
  getVentasXTipoDocumento,
  porMesSucursal,
  porProveedores,
} = require("../../controllers/facturacion/estadisticas");
const { validarCampos, validar_dato } = require("../../middlewares/validar-campos");
const { validarJWT } = require("../../middlewares/validar-jwt");
router.get(
  "/facturacion/ventas_menusales",
  [
    validarJWT,
    check("anio", "El Año es requerido").custom((e) =>
      validar_dato(e, "positivo")
    ),
    validarCampos,
  ],
  getVentasMensuales
);
router.get(
  "/facturacion/ventas_x_rango",
  [
    validarJWT,
    check("desde", "El inicio del rango es requerido").isDate(),
    check("hasta", "El fin del rango es requerido").isDate(),
    validarCampos,
  ],
  getVentasXTipoDocumento
);
router.get("/compras/por_proveedores/:id_sucursal", validarJWT, porProveedores);
router.get("/tablero/:id_sucursal/:anio/:mes", validarJWT, getDataTablero);
router.get("/compras/tipo_pastel/:id_sucursal",
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
  ],
  getPieDataProveedores
);
router.get("/compras/tipo_pastel_propinas/:id_sucursal",
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
  ],
  getPiePorcentajePropinas
);
router.get("/compras/por_mes_sucursal", validarJWT, porMesSucursal);
module.exports = router;
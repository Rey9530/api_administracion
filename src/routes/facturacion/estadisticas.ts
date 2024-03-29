import expres from "express";
const router = expres.Router();
import { check } from "express-validator";
import {
  getDataTablero,
  getPieDataProveedores,
  getPiePorcentajePropinas,
  getVentasMensuales,
  getVentasXTipoDocumento,
  porMesSucursal,
  porProveedores,
} from "../../controllers/facturacion/estadisticas";
import { validarCampos, validar_dato } from "../../middlewares/validar-campos";
import { validarJWT } from "../../middlewares/validar-jwt";
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
export default router;
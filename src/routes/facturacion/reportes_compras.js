const expres = require("express");
const router = expres.Router();
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");
const { validarJWT } = require("../../middlewares/validar-jwt");
const { libroCompras, libroComprasAlContado, obtenerListadoCompras, obtenerListadoComprasInventario } = require("../../controllers/facturacion/reportes_compras");
const { eliminarCompra, obntenerListadoFacturasAlCredito, obntenerListadoPrecheques, revertirEstadoCompra } = require("../../controllers/inventario/ingreso");
 
router.get(
  "/libro_compras",
  [
    validarJWT, 
    check("desde", "El tipo de factura es requerido").isDate(),
    check("hasta", "El tipo de factura es requerido").isDate(),
    validarCampos,
  ],
  libroCompras
); 

router.get(
  "/listado_compras_contado",
  [
    validarJWT, 
    check("fecha", "La fecha es requerida").isDate(),
    validarCampos,
  ],
  libroComprasAlContado
); 

router.get(
  "/obtener_listado_compras",
  [
    validarJWT,
    check("desde", "El parametro desde es requerido y debe ser formato fecha YYYY-mm-dd").not().isEmpty().isDate(),
    check("hasta", "El parametro hasta es requerido y debe ser formato fecha YYYY-mm-dd").not().isEmpty().isDate(),
    validarCampos,
  ],
  obtenerListadoCompras
);



router.get(
  "/obtener_listado_compras_inventario",
  [
    validarJWT,
    check("desde", "El parametro desde es requerido y debe ser formato fecha YYYY-mm-dd").not().isEmpty().isDate(),
    check("hasta", "El parametro hasta es requerido y debe ser formato fecha YYYY-mm-dd").not().isEmpty().isDate(),
    validarCampos,
  ],
  obtenerListadoComprasInventario
);
router.get(
  "/obtener_listado_compras_al_credito/:id_sucursal/:id_proveedor",
  validarJWT, 
  obntenerListadoFacturasAlCredito 
); 

router.get(
  "/obtener_pre_cheques/:id_sucursal",
  validarJWT, 
  obntenerListadoPrecheques 
); 

router.get(
  "/revertir_estado/:id_compra",
  validarJWT, 
  revertirEstadoCompra 
); 

router.delete(
  "/:id_compra",
  validarJWT, 
  eliminarCompra 
); 
module.exports = router;

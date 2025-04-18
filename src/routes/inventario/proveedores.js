
const expres = require("express");
const router = expres.Router();
const { check } = require("express-validator");
const { validarCampos, validar_dato } = require("../../middlewares/validar-campos");
const { validarJWT } = require("../../middlewares/validar-jwt");
const fileUpload = require("express-fileupload");
const {
  getRegistros,
  getRegistro,
  crearRegistro,
  actualizarRegistro,
  eliminarRegistro,
  getBancos,
  getFacturasProveedores,
} = require("../../controllers/inventario/proveedores");
const { obntenerTiposContribuyentes } = require("../../controllers/facturacion/cliente");

router.use(fileUpload()); 
router.get("/", validarJWT, getRegistros);
router.get("/listado/bancos", validarJWT, getBancos);
router.get("/listado/facturas/:id", validarJWT, getFacturasProveedores);
router.get("/:id", validarJWT, getRegistro);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(), 
    check("direccion", "La direccion es obligatoria").not().isEmpty(), 
    check("nombre_contac_1", "El nombre del primer contacto es obligatoria").not().isEmpty(), 
    check("telefono_contac_1", "El telefono del primer contacto es obligatoria").not().isEmpty(),   
    check("id_tipo_proveedor", "La sucursal es requerida").custom((e) =>
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
    check("direccion", "La direccion es obligatoria").not().isEmpty(), 
    check("nombre_contac_1", "El nombre del primer contacto es obligatoria").not().isEmpty(), 
    check("telefono_contac_1", "El telefono del primer contacto es obligatoria").not().isEmpty(),   
    check("id_tipo_proveedor", "La sucursal es requerida").custom((e) =>
      validar_dato(e, "positivo")
    ),
    validarCampos,
  ],
  actualizarRegistro
);

router.get("/obtener/tipos/contribuyentes", validarJWT, obntenerTiposContribuyentes);
router.delete("/:id", validarJWT, eliminarRegistro);

module.exports = router;

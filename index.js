require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

//listado de rutas
const perfil = require("./src/routes/perfil");
const usuarios = require("./src/routes/usuarios");
const auth = require("./src/routes/auth");
const catalogo_tipos = require("./src/routes/facturacion/catalogo_tipos");
const sucursales = require("./src/routes/facturacion/sucursales");
const catalogo_categorias = require("./src/routes/facturacion/catalogo_categorias");
const catalogo = require("./src/routes/facturacion/catalogo");
const factura = require("./src/routes/facturacion/factura");
const reportes = require("./src/routes/facturacion/reportes");
const reportes_compras = require("./src/routes/facturacion/reportes_compras");
const estadisticas = require("./src/routes/facturacion/estadisticas");
const agenda = require("./src/routes/reservas/agenda");
const cliente = require("./src/routes/facturacion/cliente");
const bloques = require("./src/routes/facturacion/bloques");
const decuentos = require("./src/routes/facturacion/decuentos");
const sistema_data = require("./src/routes/facturacion/sistema_data");
const bodegas = require("./src/routes/inventario/bodegas");
const proveedores = require("./src/routes/inventario/proveedores");
const ingreso = require("./src/routes/inventario/ingreso");
const orden_salida = require("./src/routes/inventario/orden_salida");
const utils = require("./src/routes/utils");
app.use('/utils', utils);

//intanciando rutas
app.use('/usuarios', usuarios);
app.use('/perfil', perfil);
app.use('/auth', auth);

//reportes
app.use('/reportes/facturacion', reportes);
app.use('/reportes/compras', reportes_compras);
app.use('/estadisticas', estadisticas);

//Reservas
app.use('/reservas/agenda', agenda);

//Facturacion
app.use('/facturacion/cliente', cliente);
app.use('/facturacion/factura', factura);
app.use('/facturacion/catalogo', catalogo);
app.use('/facturacion/sucursales', sucursales);
app.use('/facturacion/catalogo_tipos', catalogo_tipos);
app.use('/facturacion/catalogo_categorias', catalogo_categorias);
app.use('/facturacion/bloques', bloques);
app.use('/facturacion/descuentos', decuentos);
app.use('/facturacion/sistema_data', sistema_data);


// inventario
app.use('/inventario/bodegas', bodegas);
app.use('/inventario/proveedores', proveedores);
app.use('/inventario/ingreso', ingreso);
app.use('/inventario/orden-salida', orden_salida);


const port = process.env.PORT || 4000;
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo:', port)
});
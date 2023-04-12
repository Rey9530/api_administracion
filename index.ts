import * as dotenv from 'dotenv';
dotenv.config();
import expres from 'express';
import cors from 'cors';  

const app = expres();
app.use(cors());
app.use(expres.static('public')) ;
app.use(expres.json());

//listado de rutas
import usuarios from "./src/routes/usuarios";
import auth from "./src/routes/auth"; 
import catalogo_tipos from "./src/routes/facturacion/catalogo_tipos"; 
import sucursales from "./src/routes/facturacion/sucursales"; 
import catalogo_categorias from "./src/routes/facturacion/catalogo_categorias"; 
import catalogo from "./src/routes/facturacion/catalogo"; 
import factura from "./src/routes/facturacion/factura"; 
import reportes from "./src/routes/facturacion/reportes"; 
import estadisticas from "./src/routes/facturacion/estadisticas"; 
import cliente from "./src/routes/facturacion/cliente"; 
import bloques from "./src/routes/facturacion/bloques"; 
import decuentos from "./src/routes/facturacion/decuentos"; 
import sistema_data from "./src/routes/facturacion/sistema_data"; 

import bodegas from "./src/routes/inventario/bodegas"; 

//intanciando rutas
app.use('/usuarios', usuarios );
app.use('/auth', auth);  

//reportes
app.use('/reportes/facturacion', reportes);  
app.use('/estadisticas/facturacion', estadisticas);  

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
const port = process.env.PORT || 4000;
app.listen(process.env.PORT,()=>{
    console.log('Servidor corriendo:',port)
});
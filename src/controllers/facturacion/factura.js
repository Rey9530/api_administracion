const express = require("express");
const response = express.response;
const request = express.request;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const  getNumeroFactura = async (req = request, resp = response) => {
  let id_tipo_factura = Number(req.params.id);
  let { ids = 0 } = req.params;
  let id_sucursal = Number(ids);
  if (!(id_tipo_factura > 0)) {
    return resp.json({
      status: false,
      msg: "El tipo de factura es incorrecto",
      data: null,
    });
  }
  let tipoFactura = await prisma.facturasTipos.findFirst({
    where: { id_tipo_factura },
    include: { Bloques: { where: { estado: "ACTIVO", id_sucursal }, take: 1 } },
  });
  if (tipoFactura == null || tipoFactura.Bloques.length == 0) {
    return resp.json({
      status: false,
      msg: "No existe un bloque de facturas configurado para este tipo de factura ",
      data: null,
    });
  } else {
    tipoFactura.Bloques = tipoFactura.Bloques[0];
    return resp.json({
      status: true,
      msg: "Success",
      data: tipoFactura,
    });
  }
};

const  buscarEnCatalogo = async (req = request, resp = response) => {
  let { query = "" } = req.body;
  if (query.length == 0) {
    return resp.json({
      status: false,
      msg: "El parametro no es valido",
      data: null,
    });
  }
  let arrayQuery = query.split(" ");
  const data = await prisma.catalogo.findMany({
    where: {
      OR: arrayQuery.map((contains) => {
        return {
          nombre: {
            contains,
            mode: "insensitive",
          },
        };
      }),
    },
    include: {
      Inventario: {
        where: {
          existencia: {
            gte: 1
          }
        }
      }
    }
  });
  return resp.json({
    status: true,
    msg: "Success",
    data,
  });
};

const  buscarClientes = async (req = request, resp = response) => {
  let { query = "" } = req.body;
  if (query.length == 0) {
    return resp.json({
      status: false,
      msg: "El parametro no es valido",
      data: null,
    });
  }
  let arrayQuery = query.split(" ");
  const data = await prisma.cliente.findMany({
    where: {
      estado: "ACTIVO",
      AND: arrayQuery.map((contains) => {
        return {
          nombre: {
            contains,
            mode: "insensitive",
          },
        };
      }),
    },
    orderBy: {
      nombre: "desc",
    },
    take: 20,
    include: { Municipio: true },
  });
  return resp.json({
    status: true,
    msg: "Success",
    data,
  });
};

const  obntenerMetodosDePago = async (_ = request, resp = response) => {
  const data = await prisma.facturasMetodosDePago.findMany({
    where: { estado: "ACTIVO" },
  });
  return resp.json({
    status: true,
    msg: "Success",
    data,
  });
};

const  obntenerListadoFacturas = async (
  req = request,
  resp = response
) => {
  var desde = req.query.desde ? req.query.desde.toString() : "";
  var hasta = req.query.hasta ? req.query.hasta.toString() : "";
  let { ids = 0 } = req.params;
  let id_sucursal = Number(ids);

  // fecha.setDate(fecha.getDate() + dias);
  desde = new Date(desde);
  hasta = new Date(hasta);
  hasta.setDate(hasta.getDate() + 1);

  var total_facturado = 0;
  var total_facturas = 0;
  var total_consumidor_final = 0;
  var total_facturas_consumidor_final = 0;
  var total_credito_fiscal = 0;
  var total_facturas_credito_fiscal = 0;
  var total_anuladas = 0;
  var total_facturas_anuladas = 0;

  const data = await prisma.facturas.findMany({
    where: {
      fecha_creacion: {
        gte: desde,
        lte: hasta,
      },
      id_sucursal,
    },
    include: { Bloque: { include: { Tipo: true } } },
    orderBy: [
      {
        id_factura: "asc",
      },
    ],
  });
  data.forEach((e) => {
    total_facturas++;
    total_facturado += e.total ?? 0;
    if (e.estado == "ANULADA") {
      total_anuladas += e.total ?? 0;
      total_facturas_anuladas++;
    } else if (e.Bloque.Tipo.id_tipo_factura == 1) {
      total_consumidor_final += e.total ?? 0;
      total_facturas_consumidor_final++;
    } else {
      total_credito_fiscal += e.total ?? 0;
      total_facturas_credito_fiscal++;
    }
  });

  return resp.json({
    status: true,
    msg: "Success",
    data,
    contadores: {
      total_facturado,
      total_facturas,
      total_consumidor_final,
      total_facturas_consumidor_final,
      total_credito_fiscal,
      total_facturas_credito_fiscal,
      total_anuladas,
      total_facturas_anuladas,
    },
  });
};

const  obntenerDepartamentos = async (_ = request, resp = response) => {
  const data = await prisma.departamentos.findMany({
    where: { estado: "ACTIVO" },
  });
  return resp.json({
    status: true,
    msg: "Success",
    data,
  });
};

const  obntenerMunicipios = async (req = request, resp = response) => {
  let id_departamento = Number(req.params.id);
  if (!(id_departamento > 0)) {
    return resp.json({
      status: false,
      msg: "Identificador de departamento incorrecto",
      data: null,
    });
  }
  const data = await prisma.municipios.findMany({
    where: { estado: "ACTIVO", id_departamento },
  });
  return resp.json({
    status: true,
    msg: "Success",
    data,
  });
};

const  obntenerFactura = async (req = request, resp = response) => {
  let id_factura = Number(req.params.id);
  let { ids = 0 } = req.params;
  let id_sucursal = Number(ids);
  const data = await prisma.facturas.findFirst({
    where: { id_factura, id_sucursal },
    include: {
      FacturasDetalle: true,
      Bloque: {
        select: {
          Tipo: { select: { nombre: true, id_tipo_factura: true } },
          tira: true,
          serie: true,
        },
      },
      Municipio: { select: { nombre: true, Departamento: true } },
      Metodo: true,
    },
  });

  if (!data) {
    return resp.json({
      status: false,
      msg: "La factura no existe",
      data: null,
    });
  }

  const data_sistema = await prisma.generalData.findFirst();
  return resp.json({
    status: true,
    msg: "Success",
    data,
    data_sistema,
  });
};

const  anularFactura = async (req = request, resp = response) => {
  let id_factura = Number(req.params.id);
  let { ids = 0 } = req.params;
  let id_sucursal = Number(ids);
  const data = await prisma.facturas.findMany({
    where: { estado: "ACTIVO", id_factura, id_sucursal },
  });
  if (!data) {
    return resp.json({
      status: false,
      msg: "La factura no existe",
      data: null,
    });
  }

  await prisma.facturas.update({
    where: { id_factura },
    data: { estado: "ANULADA" },
  });

  return resp.json({
    status: true,
    msg: "Factura anulada con exito",
    data: null,
  });
};

const  cargarCierre = async (req = request, resp = response) => {
  try {
    let fillle = req.files?.files;
    let data = 0;
    if (req.files && Object.keys(req.files).length > 0) {
      data = await leerexcel(fillle.data);
    }
    return resp.json({
      status: true,
      msg: "Leido correctamente",
      data,
    });
  } catch (error) {
    return resp.json({
      status: false,
      msg: "Ha ocurrido un erro favor verificar la estructura del archivo que sea correcto",
      data: null,
    });
  }
}; 
const leerexcel = async (path) => {
  return new Promise((resolve, _) => {
    readXlsxFile(path).then((rows) => {
      var objectAmounts = {
        venta_bruta: 0,
        para_llevar: 0,
        efectivo: 0,
        credomatic: 0,
        serfinza: 0,
        promerica: 0,
        bitcoib: 0,
        syke: 0,
        propina: 0,
        hugo_app: 0,
        pedidos_ya: 0,
        otro: 0,
      };
      for (let index = 3; index <= rows.length; index++) {
        const element = rows[index];
        if (element[4] == "TOTAL") {
          index = rows.length;
          break;
        }

        objectAmounts.venta_bruta += Number(element[41]);
        objectAmounts.propina += Number(element[30]);
        var arrayDescripcion =
          element[20] != null ? element[20].toString().split("-") : [];
        if (arrayDescripcion.length > 0) {
          switch (arrayDescripcion[0]) {
            case "SERFINSA":
              objectAmounts.serfinza += Number(element[41]);
              break;
            case "PROMERICA":
              objectAmounts.promerica += Number(element[41]);
              break;
            case "EFECTIVO":
              objectAmounts.efectivo += Number(element[41]);
              break;
            case "BAC":
              objectAmounts.credomatic += Number(element[41]);
              break;
            case "PEDIDOS YA":
              objectAmounts.pedidos_ya += Number(element[41]);
              break;
            default:
              objectAmounts.otro += Number(element[41]);
              break;
          }
        }
      }

      objectAmounts = {
        venta_bruta: objectAmounts.venta_bruta.toFixed(2),
        para_llevar: objectAmounts.para_llevar.toFixed(2),
        efectivo:efectivo(objectAmounts.efectivo.toFixed(2)),
        credomatic:credomatic(objectAmounts.credomatic.toFixed(2)),
        serfinza:serfinza(objectAmounts.serfinza.toFixed(2)),
        promerica:promerica(objectAmounts.promerica.toFixed(2)),
        bitcoib:bitcoib(objectAmounts.bitcoib.toFixed(2)),
        syke:syke(objectAmounts.syke.toFixed(2)),
        propina:propina(objectAmounts.propina.toFixed(2)),
        hugo_app:hugo_app(objectAmounts.hugo_app.toFixed(2)),
        pedidos_ya:pedidos_ya(objectAmounts.pedidos_ya.toFixed(2)),
        otro:otro(objectAmounts.otro.toFixed(2)),
      };
      resolve(objectAmounts);
    });
  }).then((resp) => {
    return resp;
  });
};

const  cierreManual = async (req = request, resp = response) => {
  const { uid } = req.params;
  let {
    venta_bruta = 0,
    para_llevar = 0,
    tarjeta_credomatic = 0,
    tarjeta_serfinza = 0,
    tarjeta_promerica = 0,
    bitcoin = 0,
    syke = 0,
    total_restante = 0,
    propina = 0,
    venta_nota_sin_iva = 0,
    cortecia = 0,
    anti_cobrados = 0,
    anti_reservas = 0,
    certificado_regalo = 0,
    hugo_app = 0,
    pedidos_ya = 0,
    compras = 0,
    entrega_efectivo = 0,
    fecha_cierre = 0,
    id_sucursal = 0,
    observacion = "",
  } = req.body;
  id_sucursal = Number(id_sucursal);
  fecha_cierre = new Date(fecha_cierre);

  const sucursal = await prisma.sucursales.findFirst({
    where: { id_sucursal },
  });
  if (sucursal == null) {
    return resp.json({
      status: false,
      msg: "La sucursal no existe",
      data: null,
    });
  }

  let id_usuario = Number(uid);

  var data = await prisma.cierresDiarios.create({
    data: {
      venta_bruta,
      para_llevar,
      tarjeta_credomatic,
      tarjeta_serfinza,
      tarjeta_promerica,
      bitcoin,
      syke,
      total_restante,
      propina,
      venta_nota_sin_iva,
      cortecia,
      anti_cobrados,
      anti_reservas,
      certificado_regalo,
      hugo_app,
      pedidos_ya,
      compras,
      entrega_efectivo,
      fecha_cierre,
      id_usuario,
      id_sucursal: sucursal.id_sucursal,
      observacion,
    },
  });
  return resp.json({
    status: true,
    msg: "Cierre creado con exito",
    data,
  });
};

const  crearFactura = async (req = request, resp = response) => {
  try {
    let {
      cliente = "",
      direccion = "",
      no_registro = "",
      nit = "",
      giro = "",
      id_municipio = null,
      id_tipo_factura = 0,
      subtotal = 0,
      descuento = 0,
      iva = 0,
      iva_retenido = 0,
      iva_percivido = 0,
      total = 0,
      efectivo = 0,
      tarjeta = 0,
      cheque = 0,
      transferencia = 0,
      credito = 0,
      id_metodo_pago = 0,
      id_cliente = 0,
      id_descuento = null,
      detalle_factura = [],
    } = req.body;
    let { ids = 0 } = req.params;
    let id_sucursal = Number(ids);

    const { uid } = req.params;
    const id_usuario = Number(uid);
    if (detalle_factura == null || detalle_factura.length == 0) {
      return resp.json({
        status: false,
        msg: "La factura debe tener detalle",
        data: null,
      });
    }
    efectivo = Number(efectivo);
    id_cliente = Number(id_cliente);
    tarjeta = Number(tarjeta);
    iva_retenido = Number(iva_retenido);
    iva_retenido = Number(iva_retenido);
    cheque = Number(cheque);
    transferencia = Number(transferencia);
    credito = Number(credito);
    id_municipio = Number(id_municipio);
    id_tipo_factura = Number(id_tipo_factura);
    id_descuento = id_descuento > 0 ? id_descuento : null;
    id_municipio = id_municipio > 0 ? id_municipio : null;
    id_tipo_factura = id_tipo_factura > 0 ? id_tipo_factura : 0;

    const tipoFactura = await prisma.facturasTipos.findFirst({
      where: { id_tipo_factura },
      include: { Bloques: { where: { estado: "ACTIVO" } } },
    });
    const clientedB = await prisma.cliente.findFirst({
      where: { id_cliente },
    });

    let error = "";
    if (!(id_usuario > 0)) {
      error = "Error de token, no se detecta al usuario";
    } else if (clientedB == null) {
      // error = "Por favor seleccione un cliente";
      id_cliente = 1;
    } else if (tipoFactura == null) {
      error = "El tipo de factura no existe";
    } else if (tipoFactura.Bloques.length == 0) {
      error = "El tipo de factura no tiene un bloque activo asignado";
    } else if (tipoFactura.Bloques[0].actual > tipoFactura.Bloques[0].hasta) {
      error = "El bloque de facturas ha finalizado, configure uno nuevo para continuar.";
      await prisma.facturasBloques.update({
        data: { estado: "INACTIVO" },
        where: { id_bloque: tipoFactura.Bloques[0].id_bloque },
      });
    }
    if (error.length > 0) {
      return resp.json({
        status: false,
        msg: error,
        data: null,
      });
    }

    let db_detalle = [];
    for (let index = 0; index < detalle_factura.length; index++) {
      const detalle = detalle_factura[index];
      if (
        detalle.nombre != null &&
        detalle.nombre.length > 0 &&
        detalle.id_catalogo != null &&
        detalle.id_catalogo > 0 &&
        detalle.precio_sin_iva != null &&
        detalle.precio_sin_iva > 0 &&
        detalle.precio_con_iva != null &&
        detalle.precio_con_iva > 0 &&
        detalle.cantidad != null &&
        detalle.cantidad > 0 &&
        detalle.subtotal != null &&
        detalle.subtotal > 0 &&
        detalle.descuento != null &&
        detalle.descuento >= 0 &&
        detalle.iva != null &&
        detalle.iva >= 0 &&
        detalle.total != null &&
        detalle.total > 0
      ) {
        const no_fact = tipoFactura?.Bloques[0]?.actual.toString().padStart(6, "0");
        await descargarItemDeInventario(detalle, no_fact);
        db_detalle.push({
          id_factura: 0,
          id_catalogo: detalle.id_catalogo,
          codigo: detalle.codigo,
          nombre: detalle.nombre,
          precio_sin_iva: detalle.precio_sin_iva,
          precio_con_iva: detalle.precio_con_iva,
          cantidad: detalle.cantidad,
          subtotal: detalle.subtotal,
          descuento: detalle.descuento,
          id_descuento:
            (detalle.id_descuento != null && detalle.id_descuento) > 0
              ? detalle.id_descuento
              : null,
          iva: detalle.iva,
          total: detalle.total,
        });
      }
    }
    if (db_detalle.length == 0) {
      return resp.json({
        status: false,
        msg: "El detalle de la factura esta incorrecto",
        data: null,
      });
    }
    const bloque = tipoFactura?.Bloques[0];
    const id_bloque = tipoFactura?.Bloques[0].id_bloque;
    const numero_factura = bloque?.actual.toString().padStart(6, "0");
    const factura = await prisma.facturas.create({
      data: {
        id_sucursal,
        cliente,
        numero_factura,
        direccion,
        no_registro,
        nit,
        giro,
        id_municipio,
        id_bloque,
        efectivo,
        id_descuento,
        id_cliente,
        tarjeta,
        cheque,
        transferencia,
        credito,
        id_metodo_pago,
        subtotal,
        descuento,
        iva,
        iva_retenido,
        iva_percivido,
        total,
        id_usuario,
      },
    });
    if (factura == null) {
      return resp.json({
        status: false,
        msg: "Ha ocurrido un error al crear la factura favor intentarlo mas tarde",
        data: null,
      });
    }
    db_detalle = db_detalle.map((e) => {
      e.id_factura = factura.id_factura;
      return e;
    });
    //TODO: hacer la verificasion por si el numero actual ya se paso el limite del campo hasta
    await prisma.facturasBloques.update({
      data: { actual: bloque ? bloque.actual + 1 : 0 },
      where: { id_bloque },
    });
    await prisma.facturasDetalle.createMany({
      data: db_detalle,
    });
    const facturaCreada = await prisma.facturas.findUnique({
      where: { id_factura: factura.id_factura },
      include: {
        FacturasDetalle: true,
        Bloque: {
          select: {
            Tipo: { select: { nombre: true } },
            tira: true,
            serie: true,
          },
        },
      },
    });
    resp.json({
      status: true,
      msg: "Factura creada con exito",
      data: facturaCreada,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      status: false,
      msg: "Error inesperado reviosar log",
    });
  }
  return;
};

const descargarItemDeInventario = async (item, nomero_factura = 0) => { 
  if (item.item != null && item.item.Inventario.length > 0) {
    var id_inventario = item.item.Inventario[0].id_inventario;
    var inventario = await prisma.inventario.findFirst({
      where: {
        id_inventario
      }
    });

    await prisma.inventario.update({
      where: {
        id_inventario
      },
      data: {
        existencia: (inventario?.existencia ?? 0) - item.cantidad
      }
    });

    var kardex = await prisma.kardex.findFirst({
      where: {
        id_catalogo: item.id_catalogo
      },
      orderBy: {
        id_kardex: "desc"
      }
    }); 
    var nInventario =  ((kardex?.inventario ?? 0) - item.cantidad) ?? 0;
    await prisma.kardex.create({
      data: {
        id_catalogo: item.id_catalogo,
        id_compras_detalle: (kardex?.id_compras_detalle ?? 0),
        tipo_movimiento: 2,
        descripcion: `Salida por Factura # ${nomero_factura}`,
        costo: kardex?.costo,
        cantidad: item.cantidad,
        subtotal: item.cantidad * (kardex?.costo_promedio ?? 0),
        costo_promedio: (kardex?.costo_promedio ?? 0),
        inventario:nInventario,
        total: nInventario * (kardex?.costo_promedio ?? 0),
      }
    }); 
  } 
}

module.exports = {
  getNumeroFactura,
  buscarEnCatalogo,
  buscarClientes,
  obntenerMetodosDePago,
  obntenerListadoFacturas,
  obntenerDepartamentos,
  obntenerMunicipios,
  obntenerFactura,
  anularFactura,
  cargarCierre,
  leerexcel,
  cierreManual,
  crearFactura
};
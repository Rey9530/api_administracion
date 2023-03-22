import expres from "express";
const response = expres.response;
const request = expres.request;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getConsumidorFinal = async (req = request, resp = response) => {
  let { mes = 0, anio = 0 }: any = req.query;

  mes = mes > 0 ? mes : 0;
  let diasMes: any = new Date(anio, mes, 0);
  mes = mes > 0 ? mes - 1 : 0;
  diasMes = diasMes.getDate();
  var arrayDatos: any[] = [];
  // for (let index = 14; index <= 15; index++) {
  let totales: any = {};
  totales.ventas_exentas = 0;
  totales.ventas_no_sujetas = 0;
  totales.ventas_locales = 0;
  totales.ventas_exportacion = 0;
  totales.ventas_totales = 0;
  totales.ventas_terceros = 0;

  for (let index = 1; index <= diasMes; index++) {
    var fecha = new Date(anio, mes, index);
    var desde = new Date(anio, mes, index, 0, 0, 0);
    var hasta = new Date(anio, mes, index, 23, 59, 59);
    var fecha_creacio = {
      fecha_creacion: {
        gte: desde,
        lte: hasta,
      },
    };

    const [facturaInit, facturaEnd, facturas] = await Promise.all([
      await prisma.facturas.findFirst({
        where: {
          ...fecha_creacio,
          Bloque: { Tipo: { id_tipo_factura: 1 } },
        },
      }),
      await prisma.facturas.findFirst({
        where: {
          ...fecha_creacio,
          Bloque: { Tipo: { id_tipo_factura: 1 } },
        },
        orderBy: {
          id_factura: "desc",
        },
      }),
      await prisma.facturas.findMany({
        where: {
          ...fecha_creacio,
          Bloque: { Tipo: { id_tipo_factura: 1 } },
        },
      }),
    ]);

    var ventas_locales = 0; 
    facturas.forEach((item) => {
      if (item.estado == "ACTIVO") {
        ventas_locales += item.total ?? 0;
      }
    });

    totales.ventas_locales += ventas_locales;
    totales.ventas_totales += ventas_locales;
    var fila = {
      index,
      fecha,
      desde: facturaInit?.numero_factura ?? 0,
      hasta: facturaEnd?.numero_factura ?? 0,
      maquina: "-",
      ventas_exentas: 0,
      ventas_no_sujetas: 0,
      ventas_locales,
      ventas_exportacion: 0,
      ventas_totales: ventas_locales,
      ventas_terceros: 0,
    };
    arrayDatos.push(fila);
  }
  resp.json({
    status: true,
    msg: "Listado de registros",
    data: arrayDatos,
    totales,
  });
};

export const getCreditoFiscal = async (req = request, resp = response) => {
  var desde1: any = req.query.desde!.toString().split("-");
  var hasta1: any = req.query.hasta!.toString().split("-");
  var desde = new Date(desde1[0], desde1[1] - 1, desde1[2], 0, 0, 0);
  var hasta = new Date(hasta1[0], hasta1[1] - 1, hasta1[2], 23, 59, 59);
  var totales: any[] = [];
  var data = await prisma.facturas.findMany({
    where: {
      fecha_creacion: {
        gte: desde,
        lte: hasta,
      },
      Bloque: { Tipo: { id_tipo_factura: 2 } },
    },
  });

  resp.json({
    status: true,
    msg: "Listado de registros",
    data,
    totales,
  });
};

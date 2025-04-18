const express = require("express");
const response = express.response;
const request = express.request;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const  libroCompras = async (req = request, resp = response) => {
  var desde1 = req.query.desde ? req.query.desde.toString() : "";
  var hasta1 = req.query.hasta ? req.query.hasta.toString() : "";
  var desde = new Date(desde1[0], desde1[1] - 1, desde1[2], 0, 0, 0);
  var hasta = new Date(hasta1[0], hasta1[1] - 1, hasta1[2], 23, 59, 59);
  var data = await prisma.compras.findMany({
    where: {
      fecha_creacion: {
        gte: desde,
        lte: hasta,
      },
    },
    include: { Proveedor: true },
  });

  resp.json({
    status: true,
    msg: "Listado de registros",
    data,
  });
};

const  libroComprasAlContado = async (req = request, resp = response) => {
  var desde1 = req.query.desde ? req.query.desde.toString().split("-") : "";
  var hasta1 = req.query.hasta ? req.query.hasta.toString().split("-") : "";
  var id_sucursal = req.query.id_sucursal;
  var desde = new Date(desde1[0], desde1[1] - 1, desde1[2], 0, 0, 0);
  var hasta = new Date(hasta1[0], hasta1[1] - 1, hasta1[2], 23, 59, 59);

  id_sucursal = Number(id_sucursal);
  var wSucursal = {};
  if (id_sucursal > 0) {
    wSucursal = { id_sucursal };
  }
  var data = await prisma.compras.findMany({
    where: {
      fecha_creacion: {
        gte: desde,
        lte: hasta,
      },
      ...wSucursal,
      tipo_pago: "CONTADO",
    },
    include: { Proveedor: true },
  });

  resp.json({
    status: true,
    msg: "Listado de registros",
    data,
  });
};

const  obtenerListadoCompras = async (req = request, resp = response) => {
  var desde = req.query.desde ? req.query.desde.toString() : "";
  var hasta = req.query.hasta ? req.query.hasta.toString() : "";
  desde = new Date(desde);
  hasta = new Date(hasta);
  hasta.setDate(hasta.getDate() + 1);

  const data = await prisma.compras.findMany({
    where: {
      fecha_creacion: {
        gte: desde,
        lte: hasta,
      },
    },
    include: { Proveedor: true, Sucursales: true, FacturasTipos: true },
    orderBy: [
      {
        id_compras: "asc",
      },
    ],
  });

  return resp.json({
    status: true,
    msg: "Success",
    data,
  });
};

const  obtenerListadoComprasInventario = async (
  req = request,
  resp = response
) => {
  var desde = req.query.desde ? req.query.desde.toString() : "";
  var hasta = req.query.hasta ? req.query.hasta.toString() : "";
  desde = new Date(desde);
  hasta = new Date(hasta);
  hasta.setDate(hasta.getDate() + 1);

  const data = await prisma.compras.findMany({
    where: {
      fecha_creacion: {
        gte: desde,
        lte: hasta,
      },
      id_bodega: {
        gte: 1,
      },
    },
    include: {
      Proveedor: true,
      Sucursales: true,
      FacturasTipos: true,
      Bodegas: true,
      ComprasDetalle: { include: { Catalogo: { select: { nombre: true } } } },
    },
    orderBy: [
      {
        id_compras: "asc",
      },
    ],
  });

  return resp.json({
    status: true,
    msg: "Success",
    data,
  });
};

module.exports = {
  libroCompras,
  libroComprasAlContado,
  obtenerListadoCompras,
  obtenerListadoComprasInventario,
};
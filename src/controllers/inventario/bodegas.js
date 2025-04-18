const express = require("express");
const response = express.response;
const request = express.request;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const  getRegistros = async (__, resp = response) => {
  const registros = await prisma.bodegas.findMany({
    where: { estado: "ACTIVO" },
    include: { Sucursales: true },
    orderBy: {
      id_bodega: "asc", 
    },
  });
  const total = await registros.length;
  resp.json({
    status: true,
    msg: "Listado de registros",
    registros,
    total,
  });
};

const  getRegistro = async (req = request, resp = response) => {
  let uid = Number(req.params.id);
  const registros = await prisma.bodegas.findFirst({
    where: { id_bodega: uid, estado: "ACTIVO" },
  });

  if (!registros) {
    resp.status(400).json({
      status: false,
      msg: "El registro no existe",
    });
  } else {
    resp.json({
      status: true,
      msg: "Exito",
      registros,
    });
  }
};

const  updateAsPrinicpal = async (req = request, resp = response) => {
  let uid = Number(req.params.id);

  try {
    const registros = await prisma.bodegas.findFirst({
      where: { id_bodega: uid, estado: "ACTIVO" },
    });
    if (!registros) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    } 
    await prisma.bodegas.updateMany({
      where: { id_sucursal: registros?.id_sucursal, estado: "ACTIVO" },
      data: {
        es_principal: 0
      }
    }); 
    await prisma.bodegas.update({
      where: { id_bodega: registros?.id_bodega },
      data: {
        es_principal: 1
      }
    });
    return resp.json({
      status: true,
      msg: "Datos actualizados correctamente",
      data:null,
    });
  } catch (error) {
    console.log(error)
    return resp.json({
      status: false,
      msg: "Ha ocurrido un error revise los logs",
    });
  }
};

const  crearRegistro = async (req = request, resp = response) => {
  let { nombre = "", id_sucursal = 0 } = req.body;
  try {
    id_sucursal = Number(id_sucursal);
    const data = await prisma.bodegas.create({
      data: {
        nombre,
        id_sucursal,
      },
    });
    resp.json({
      status: true,
      msg: "Registro creado con Éxito",
      data,
    });
  } catch (error) {
    resp.status(500).json({
      status: false,
      msg: "Error inesperado reviosar log",
    });
  }
  return;
};

const  actualizarRegistro = async (req = request, resp = response) => {
  let uid = Number(req.params.id);
  try {
    let { nombre = "", id_sucursal = 0 } = req.body;
    id_sucursal = Number(id_sucursal);

    const [registro, sucursal] = await Promise.all([
      await prisma.bodegas.findFirst({
        where: { id_bodega: uid, estado: "ACTIVO" },
      }),
      await prisma.sucursales.findFirst({
        where: { id_sucursal },
      }),
    ]);
    if (!registro || !sucursal) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe o la sucursal esta incorrecta",
      });
    }
    const registroActualizado = await prisma.bodegas.update({
      where: { id_bodega: uid },
      data: { nombre, id_sucursal },
    });
    resp.json({
      status: true,
      msg: "Registro Actualizado",
      data: registroActualizado,
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

const  eliminarRegistro = async (req = request, resp = response) => {
  let uid = Number(req.params.id);
  try {
    const registro = await prisma.bodegas.findFirst({
      where: { id_bodega: uid, estado: "ACTIVO" },
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    await prisma.bodegas.update({
      data: { estado: "INACTIVO" },
      where: { id_bodega: uid },
    });
    resp.json({
      status: true,
      msg: "Registro elimiando",
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

module.exports = {
  getRegistros,
  getRegistro,
  crearRegistro,
  actualizarRegistro,
  eliminarRegistro,
  updateAsPrinicpal
};
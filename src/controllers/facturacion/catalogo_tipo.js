const express = require("express");
const response = express.response;
const request = express.request;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

 getRegistros = async (__, resp = response) => {
  const registros = await prisma.catalogoTipo.findMany({
    where: { estado: "ACTIVO" },
  });
  const total = await registros.length;
  resp.json({
    status: true,
    msg: "Listado de registros",
    registros,
    total,
  });
};
 getRegistro = async (req = request, resp = response) => {
  let uid = Number(req.params.id);
  const registros = await prisma.catalogoTipo.findFirst({
    where: { id_tipo: uid, estado: "ACTIVO" },
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

 crearRegistro = async (req = request, resp = response) => {
  let { nombre="" } = req.body;
  try {   
    const data = await prisma.catalogoTipo.create({
      data: {
        nombre
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

 actualizarRegistro = async (req = request, resp = response) => {
  let uid = Number(req.params.id);
  try {
    const registro = await prisma.catalogoTipo.findFirst({
      where: { id_tipo: uid ,estado: "ACTIVO"},
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    } 
    let { nombre="" } = req.body;  
    const registroActualizado = await prisma.catalogoTipo.update({
      where: { id_tipo: uid },
      data: { nombre },
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

 eliminarRegistro = async (req = request, resp = response) => {
  let uid = Number(req.params.id);
  try {
    const registro = await prisma.catalogoTipo.findFirst({
      where: { id_tipo: uid, estado: "ACTIVO" },
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    await prisma.catalogoTipo.update({
      data: { estado: "INACTIVO" },
      where: { id_tipo: uid },
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
};
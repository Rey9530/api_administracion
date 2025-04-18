const express = require("express");
const response = express.response;
const request = express.request;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

 getRegistros = async (__, resp = response) => {
  const registros = await prisma.catalogoCategorias.findMany({
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
  const registros = await prisma.catalogoCategorias.findFirst({
    where: { id_categoria: uid, estado: "ACTIVO" },
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
    const data = await prisma.catalogoCategorias.create({
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
    const registro = await prisma.catalogoCategorias.findFirst({
      where: { id_categoria: uid ,estado: "ACTIVO"},
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    } 
    let { nombre="" } = req.body;  
    const registroActualizado = await prisma.catalogoCategorias.update({
      where: { id_categoria: uid },
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
    const registro = await prisma.catalogoCategorias.findFirst({
      where: { id_categoria: uid, estado: "ACTIVO" },
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    await prisma.catalogoCategorias.update({
      data: { estado: "INACTIVO" },
      where: { id_categoria: uid },
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

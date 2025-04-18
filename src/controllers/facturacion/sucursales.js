const express = require("express");
const response = express.response;
const request = express.request;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getRegistros = async (req, resp = response) => {
  var id_usuario = Number(req.params.uid);
  var wSucursal = {};
  if (id_usuario > 0) {
    var usuario = await prisma.usuarios.findFirst({ where: { id: id_usuario } });
    if (Number(usuario?.id_sucursal_reser) > 0 && usuario?.id_rol!=1) {
      wSucursal = { id_sucursal: usuario?.id_sucursal_reser };
    }
  }


  const registros = await prisma.sucursales.findMany({
    where: { estado: "ACTIVO", ...wSucursal },
  });
  const total = await registros.length;
  resp.json({
    status: true,
    msg: "Listado de registros",
    registros,
    total,
  });
};

const getRegistro = async (req = request, resp = response) => {
  let uid = Number(req.params.id);
  const registros = await prisma.sucursales.findFirst({
    where: { id_sucursal: uid, estado: "ACTIVO" },
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

const crearRegistro = async (req = request, resp = response) => {
  let { nombre = "", color = "" } = req.body;
  try {
    const data = await prisma.sucursales.create({
      data: {
        nombre,
        color,
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

const actualizarRegistro = async (req = request, resp = response) => {
  let uid = Number(req.params.id);
  try {
    const registro = await prisma.sucursales.findFirst({
      where: { id_sucursal: uid, estado: "ACTIVO" },
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    let { nombre = "", color = "" } = req.body;
    const registroActualizado = await prisma.sucursales.update({
      where: { id_sucursal: uid },
      data: { nombre, color },
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

const eliminarRegistro = async (req = request, resp = response) => {
  let uid = Number(req.params.id);
  try {
    const registro = await prisma.sucursales.findFirst({
      where: { id_sucursal: uid, estado: "ACTIVO" },
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    await prisma.sucursales.update({
      data: { estado: "INACTIVO" },
      where: { id_sucursal: uid },
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
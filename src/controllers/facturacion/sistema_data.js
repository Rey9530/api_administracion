const express = require("express");
const response = express.response;
const request = express.request;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const  getDatosSistema = async (_ = request, resp = response) => {
  try {
    const data = await prisma.generalData.findFirst();
    resp.json({
      status: true,
      msg: "Registros",
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

const  updateDatosSistema = async (req = request, resp = response) => {
  let uid = Number(req.params.id);
  try {
    let {
      nombre_sistema = 0,
      impuesto = 0,
      id_tipo_contribuyente = 0,
      direccion = "",
      razon = "",
      nit = "",
      nrc = "",
      contactos = "",
    } = req.body;
    id_tipo_contribuyente = Number(id_tipo_contribuyente);
    id_tipo_contribuyente =
      id_tipo_contribuyente > 0 ? id_tipo_contribuyente : null;
    await prisma.generalData.update({
      where: { id_general: uid },
      data: {
        nombre_sistema,
        impuesto,
        direccion,
        razon,
        nit,
        nrc,
        contactos,
        id_tipo_contribuyente,
      },
    });
    resp.json({
      status: true,
      msg: "Registro actualizado con exito",
    });
  } catch (error) {
    resp.status(500).json({
      status: false,
      msg: "Error inesperado reviosar log",
    });
  }
  return;
};


module.exports = {
  getDatosSistema,
  updateDatosSistema,
};
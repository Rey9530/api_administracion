const express = require("express");
const response = express.response;
const request = express.request;
const bcrypt = require("bcryptjs");
const { getenerarJWT } = require("../helpers/jwt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const  login = async (req = request, resp = response) => {
  const { usuario, password } = req.body;
  try {
    const usaurioDB = await prisma.usuarios.findFirst({
      where: {
        usuario,
        estado: "ACTIVO",
      },
    });

    if (!usaurioDB) {
      return resp.status(400).json({
        status: false,
        msg: "El usuario o clave son incorrectos",
        data: null,
      });
    }
    const validarPass = bcrypt.compareSync(password, usaurioDB.password);

    if (!validarPass) {
      return resp.status(400).json({
        status: false,
        msg: "El email o clave no existe",
      });
    }
    const token = await getenerarJWT(usaurioDB.id,usaurioDB.id_sucursal);
    const dataGeneral = await prisma.generalData.findFirst();
    if (dataGeneral) {
      dataGeneral.id_general = 0;
    }
    resp.json({
      status: true,
      msg: "Logueado con exito",
      data: { ...usaurioDB, token, ...dataGeneral },
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      status: false,
      msg: "Error revise logs",
    });
  }
  return;
};

const  loginRenew = async (req = request, resp = response) => {
  let uid = Number(req.params.uid);
  const usaurioDB = await prisma.usuarios.findFirst({
    where: {
      id: uid,
      estado: "ACTIVO",
    },
  }); 
  if (!usaurioDB) {
    resp.json({
      status: false,
      msg: "Error al renovar el Token ",
      data: null,
    });
  }
  const token = await getenerarJWT(uid, usaurioDB?.id_sucursal);
  const dataGeneral = await prisma.generalData.findFirst();
  if (dataGeneral) {
    dataGeneral.id_general = 0;
  }
  resp.json({
    status: true,
    msg: "Token renovado",
    data: { ...usaurioDB, token, ...dataGeneral },
  });
};

module.exports = {
  login,
  loginRenew,
};

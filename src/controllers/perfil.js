const express = require("express");
const response = express.response;
const request = express.request;
const bcrypt = require("bcryptjs");
const { getenerarJWT } = require("../helpers/jwt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getUsuario = async (req = request, resp = response) => {
  const { uid } = req.params;
  const id = Number(uid);

  try {
    const data = await prisma.usuarios.findFirst({
      where: { id, estado: "ACTIVO" },
      include: { Sucursales: true, Roles: true }
    });
    if (data == null) {
      return resp.status(400).json({
        status: false,
        msg: "El usuario no existe o esta deshabilitado", uid
      });
    }

    return resp.json({
      status: true,
      msg: "Usuario",
      data
    });
  } catch (error) {
    return resp.status(400).json({
      status: false,
      msg: "El usuario no existe o esta deshabilitado"
    });
  }

};

 crearUsuario = async (req = request, resp = response) => {
  let { usuario, password, nombres, apellidos, dui, id_rol, id_sucursal } =
    req.body;
  try {
    const existeRol = await prisma.roles.findUnique({ where: { id_rol } });
    if (!existeRol) {
      return resp.status(400).json({
        status: false,
        msg: "El registro del rol no existe",
      });
    }
    const existeSucursal = await prisma.sucursales.findUnique({
      where: { id_sucursal },
    });
    if (!existeSucursal) {
      return resp.status(400).json({
        status: false,
        msg: "El registro de la sucursal no existe",
      });
    }

    const existeEmail = await prisma.usuarios.findFirst({
      where: {
        usuario
      },
    });
    if (existeEmail) {
      return resp.status(400).json({
        status: true,
        msg: usuario + " ya existe",
      });
    }
    //encriptar clave
    const salt = bcrypt.genSaltSync();
    password = bcrypt.hashSync(password, salt);

    const userSaved = await prisma.usuarios.create({
      data: {
        usuario,
        password,
        nombres,
        apellidos,
        dui,
        id_rol,
        id_sucursal,
      },
    });

    const token = await getenerarJWT(userSaved.id);

    resp.json({
      status: true,
      msg: "Crear usuario",
      data: { ...userSaved, token },
    });
  } catch (error) {
    resp.status(500).json({
      status: false,
      msg: "Error inesperado reviosar log",
    });
  }
  return;
};
 actualizarUsuario = async (req = request, resp = response) => {
  let uid = Number(req.params.uid);
  try {
    const existeEmail = await prisma.usuarios.findFirst({
      where: { id: uid, estado: "ACTIVO" },
    });
    if (!existeEmail) {
      return resp.status(400).json({
        status: false,
        msg: "El usuario no existe o esta deshabilitado",
      });
    }
    const { nombres = "", apellidos = "", dui = "" } = req.body;


    const usuarioUpdate = await prisma.usuarios.update({
      where: { id: uid },
      data: { nombres, apellidos, dui },
      include:{
        Sucursales:true,
        Roles:true
      }
    });
    resp.json({
      status: true,
      msg: "Datos Actualizado",
      usuario: usuarioUpdate,
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



 actualizarClaveUsuario = async (req = request, resp = response) => {
  let uid = Number(req.params.uid);
  try {
    const usuarioDb = await prisma.usuarios.findFirst({
      where: { id: uid, estado: "ACTIVO" },
    });
    if (!usuarioDb) {
      return resp.json({
        status: false,
        msg: "El usuario no existe o esta deshabilitado",
      });
    }
    let { clave_actual = "",
      clave_nueva = "",
      clave_confirmada = "" } = req.body;
 

    const validarPass = bcrypt.compareSync(clave_actual, usuarioDb.password); 
    if (!validarPass) {
      return resp.json({
        status: false,
        msg: "La clave actual es incorrecta",
      });
    }

    if (clave_nueva !== clave_confirmada) {
      return resp.json({
        status: false,
        msg: "La claves no coinciden",
      }); 
    } 

    const salt = bcrypt.genSaltSync();
    clave_nueva = bcrypt.hashSync(clave_nueva, salt);
    const usuarioUpdate = await prisma.usuarios.update({
      where: { id: uid },
      data: { password:clave_nueva },
    });
    resp.json({
      status: true,
      msg: "la contraseña fue actualizada con exito",
      usuario: usuarioUpdate,
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
  getUsuario,
  crearUsuario,
  actualizarUsuario,
  actualizarClaveUsuario
};
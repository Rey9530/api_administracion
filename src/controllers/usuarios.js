const express = require("express");
const response = express.response;
const request = express.request;
const bcrypt = require("bcryptjs");
const { getenerarJWT } = require("../helpers/jwt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getUsuarios = async (__, resp = response) => {
  const usuarios = await prisma.usuarios.findMany({
    where: { estado: "ACTIVO" },
    select: {
      nombres: true,
      apellidos: true,
      dui: true,
      usuario: true,
      Roles: true,
      Sucursales: true,
      id: true,
      id_sucursal_reser: true,
    }
  });
  const total = await usuarios.length;
  resp.json({
    status: true,
    msg: "Usuario",
    usuarios,
    total,
  });
};

const getRoles = async (__, resp = response) => {
  const data = await prisma.roles.findMany({
    where: { Estado: "ACTIVO" },
  });
  resp.json({
    status: true,
    msg: "Registros",
    data,
  });
};
const getUsuario = async (req = request, resp = response) => {
  let uid = Number(req.params.id);
  const usuario = await prisma.usuarios.findFirst({
    where: { id: uid, estado: "ACTIVO" },
  });

  if (!usuario) {
    resp.status(400).json({
      status: false,
      msg: "El usuario no existe o esta deshabilitado",
    });
  } else {
    resp.json({
      status: true,
      msg: "Usuario",
      usuario,
    });
  }
};

const crearUsuario = async (req = request, resp = response) => {
  let { usuario, nombres, apellidos, dui, id_rol, id_sucursal, id_sucursal_reser = 0 } =
    req.body;
  try {
    id_rol = Number(id_rol)
    id_sucursal = Number(id_sucursal)
    id_sucursal_reser = Number(id_sucursal_reser)
    id_sucursal_reser = id_sucursal_reser > 0 ? id_sucursal_reser : null;
    const existeRol = await prisma.roles.findUnique({ where: { id_rol } });
    if (!existeRol) {
      return resp.status(400).json({
        status: false,
        msg: "El registro del rol no existe",
      });
    }
    if (id_sucursal > 0) {
      const existeSucursal = await prisma.sucursales.findUnique({
        where: { id_sucursal },
      });
      if (!existeSucursal) {
        return resp.status(400).json({
          status: false,
          msg: "El registro de la sucursal no existe",
        });
      }
    }

    const existeEmail = await prisma.usuarios.findFirst({
      where: {
        usuario
      },
    });
    if (existeEmail) {
      return resp.json({
        status: false,
        msg: usuario + " ya existe",
      });
    }
    //encriptar clave 
    const salt = bcrypt.genSaltSync();
    let password = bcrypt.hashSync("1234", salt);

    const userSaved = await prisma.usuarios.create({
      data: {
        usuario,
        password,
        nombres,
        apellidos,
        dui,
        id_rol,
        id_sucursal,
        id_sucursal_reser
      },
      select: {
        nombres: true,
        apellidos: true,
        dui: true,
        usuario: true,
        Roles: true,
        Sucursales: true,
        id: true,
        id_sucursal_reser: true,
      }
    });

    const token = await getenerarJWT(userSaved.id);

    resp.json({
      status: true,
      msg: "Crear usuario",
      data: { ...userSaved, token },
    });
  } catch (error) {
    console.log(error)
    resp.status(500).json({
      status: false,
      msg: "Error inesperado reviosar log",
    });
  }
  return;
};
const actualizarUsuario = async (req = request, resp = response) => {
  let uid = Number(req.params.id);
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

    let { usuario, password, nombres, apellidos, dui, id_rol, id_sucursal,id_sucursal_reser=0 } =
      req.body;
    id_rol = Number(id_rol)
    id_sucursal = Number(id_sucursal)
    id_sucursal_reser = Number(id_sucursal_reser)
    id_sucursal_reser = id_sucursal_reser > 0 ? id_sucursal_reser : null;
    if (existeEmail.usuario != usuario) {
      const existeEmail = await prisma.usuarios.findFirst({
        where: { usuario },
      });
      if (existeEmail) {
        return resp.json({
          status: false,
          msg: "Ya existe un registro con ese usuario",
        });
      }
    }

    const existeRol = await prisma.roles.findUnique({ where: { id_rol } });
    if (!existeRol) {
      return resp.status(400).json({
        status: false,
        msg: "El registro del rol no existe",
      });
    }
    if (id_sucursal > 0) {
      const existeSucursal = await prisma.sucursales.findUnique({
        where: { id_sucursal },
      });
      if (!existeSucursal) {
        return resp.status(400).json({
          status: false,
          msg: "El registro de la sucursal no existe",
        });
      }

    }

    const usuarioUpdate = await prisma.usuarios.update({
      where: { id: uid },
      data: { usuario, password, nombres, apellidos, dui, id_rol, id_sucursal,id_sucursal_reser },
    });
    resp.json({
      status: true,
      msg: "Usuario Actualizado",
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

const eliminarUsuarios = async (req = request, resp = response) => {
  let uid = Number(req.params.id);
  try {
    const existeEmail = await prisma.usuarios.findFirst({
      where: { id: uid, estado: "ACTIVO" },
    });
    if (!existeEmail) {
      return resp.status(400).json({
        status: false,
        msg: "El usuario no existe o ya esta deshabilitado",
      });
    }
    await prisma.usuarios.update({
      data: { estado: "INACTIVO" },
      where: { id: uid },
    });
    resp.json({
      status: true,
      msg: "Usuario elimiando",
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
  getUsuarios,
  getUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuarios,
  getRoles,
};
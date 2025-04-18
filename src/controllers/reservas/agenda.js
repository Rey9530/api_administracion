const express = require("express");
const response = express.response;
const request = express.request;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const  getRegistros = async (req = request, resp = response) => {
  let { id_sucursal = 0, turno = "DESAYUNO" } = req.query;
  id_sucursal = Number(id_sucursal);
  var wSucursal = {};
  if (id_sucursal > 0) {
    wSucursal = { id_sucursal };
  }
  const registros = await prisma.agenda.findMany({
    include: { Sucursales: true, Usuario: true },
    where: { ...wSucursal },
  });
  const total = await registros.length;
  var ahora = await getRegistrosDelDia(id_sucursal, turno);
  resp.json({
    status: true,
    msg: "Listado de registros",
    registros,
    total,
    ahora,
  });
};
const  getRegistrosFiltrados = async (req = request, resp = response) => {
  let {
    id_sucursal = 0,
  } = req.params; 

  var desde_v = req.query.desde ? req.query.desde.toString() : "";
  var hasta_v = req.query.hasta ? req.query.hasta.toString() : "";
  var turno = req.query.turno; 
  var desde = new Date(desde_v);
  var hasta = new Date(hasta_v);
  hasta.setHours(hasta.getHours() + 23);
  hasta.setMinutes(hasta.getMinutes() + 59);  
  var wMes = {
    fecha_creacion: {
      gte: desde,
      lte: hasta,
    },
  };
  id_sucursal = Number(id_sucursal);
  var wSucursal = {};
  if (id_sucursal > 0) {
    wSucursal = { id_sucursal };
  }

  var wTurno = {};
  if (turno.length > 0) {
    wTurno = { turno };
  }
  const [pendiente, confirmada, completada, cancelada] = await Promise.all([
    await prisma.agenda.count({
      where: {
        estado: "PENDIENTE",
        ...wSucursal,
        ...wMes,
        ...wTurno,
      },
    }),
    await prisma.agenda.count({
      where: {
        estado: "CONFIRMADA",
        ...wSucursal,
        ...wMes,
        ...wTurno
      },
    }),
    await prisma.agenda.count({
      where: {
        estado: "COMPLETADA",
        ...wSucursal,
        ...wMes,
        ...wTurno
      },
    }),
    await prisma.agenda.count({
      where: {
        estado: "CANCELADA",
        ...wSucursal,
        ...wMes,
        ...wTurno
      },
    }),
  ]);

  const registros = await prisma.agenda.findMany({
    include: { Sucursales: true, Usuario: true },
    where: {
      ...wSucursal,
      ...wMes,
      ...wTurno,
    },
    orderBy: {
      inicio: "asc"
    }
  });
  resp.json({
    status: true,
    msg: "Listado de registros",
    registros,
    contadores: {
      pendiente,
      confirmada,
      completada,
      cancelada,
    },
  });
};

const  getRegistrosDelDia = async (id_sucursal = 0, turno = "DESAYUNO") => {
  id_sucursal = Number(id_sucursal);
  var wSucursal = {};
  if (id_sucursal > 0) {
    wSucursal = { id_sucursal };
  }

  var wTurno = {};
  if (turno.length > 0) {
    wTurno = { turno };
  }
  var ahora = new Date();
  var y = ahora.getFullYear();
  var m = ahora.getMonth();
  var d = ahora.getDate();
  var desde = new Date(y, m, d, 0, 0, 0);
  var hasta = new Date(y, m, d, 0, 0, 0);
  hasta.setHours(hasta.getHours() + 23);
  const registros = await prisma.agenda.findMany({
    include: { Sucursales: true },
    where: {
      ...wSucursal,
      ...wTurno,
      inicio: {
        gte: desde,
        lte: hasta,
      },
      OR: [
        {
          estado: "CONFIRMADA",
        },
        {
          estado: "PENDIENTE",
        },
      ],
    },
    orderBy: {
      inicio: "asc",
    },
  });
  return registros;
};

const  getRegistro = async (req = request, resp = response) => {
  let uid = Number(req.params.id);
  const registros = await prisma.agenda.findFirst({
    where: { id_agenda: uid },
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

const  crearRegistro = async (req = request, resp = response) => {
  let { uid = 0 } = req.params;
  uid = Number(uid);
  let {
    nombre = "",
    id_sucursal = 0,
    zona = "",
    no_personas = "",
    turno = "DESAYUNO",
    telefono = "",
    date = "",
    start = "",
    nota = "",
  } = req.body;
  date = date.split("T")[0];
  start = start.split(":");
  var inicio = new Date(date);
  inicio.setHours(inicio.getHours() + Number(start[0]));
  inicio.setMinutes(inicio.getMinutes() + Number(start[1]));

  var fin = new Date(date);
  fin.setHours(fin.getHours() + Number(start[0]));
  fin.setMinutes(fin.getMinutes() + Number(start[1]));
  fin.setHours(fin.getHours() + 2);
  try {
    id_sucursal = Number(id_sucursal);
    const data = await prisma.agenda.create({
      data: {
        zona,
        id_sucursal,
        no_personas,
        nombre,
        telefono,
        inicio,
        fin,
        nota,
        turno,
        id_usuario: uid,
      },
    });
    resp.json({
      status: true,
      msg: "Registro creado con Éxito",
      data,
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

const  actualizarRegistro = async (req = request, resp = response) => {
  let uid = Number(req.params.id);
  try {
    let {
      nombre = "",
      id_sucursal = 0,
      zona = "",
      no_personas = "",
      turno = "DESAYUNO",
      telefono = "",
      date = "",
      start = "",
      nota = "",
    } = req.body;
    id_sucursal = Number(id_sucursal);

    date = date.split("T")[0];
    start = start.split(":");
    var inicio = new Date(date);
    inicio.setHours(inicio.getHours() + Number(start[0]));
    inicio.setMinutes(inicio.getMinutes() + Number(start[1]));

    var fin = new Date(date);
    fin.setHours(fin.getHours() + Number(start[0]));
    fin.setMinutes(fin.getMinutes() + Number(start[1]));
    fin.setHours(fin.getHours() + 2);

    const [registro, sucursal] = await Promise.all([
      await prisma.agenda.findFirst({
        where: { id_agenda: uid },
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
    const registroActualizado = await prisma.agenda.update({
      where: { id_agenda: uid },
      data: {
        zona,
        id_sucursal,
        no_personas,
        nombre,
        telefono,
        inicio,
        fin,
        nota,
        turno,
      },
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
const  actualizarEstadoRegistro = async (
  req = request,
  resp = response
) => {
  let uid = Number(req.params.id);
  try {
    let { estado = "" } = req.body;
    const [registro] = await Promise.all([
      await prisma.agenda.findFirst({
        where: { id_agenda: uid },
      }),
    ]);
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    const registroActualizado = await prisma.agenda.update({
      where: { id_agenda: uid },
      data: {
        estado,
      },
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
    const registro = await prisma.agenda.findFirst({
      where: { id_agenda: uid },
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    await prisma.agenda.update({
      data: { estado: "CANCELADA" },
      where: { id_agenda: uid },
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
  getRegistrosFiltrados,
  getRegistro,
  crearRegistro,
  actualizarRegistro,
  actualizarEstadoRegistro,
  eliminarRegistro,
};
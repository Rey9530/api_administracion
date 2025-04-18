const express = require("express");
const response = express.response;
const request = express.request;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const  getRegistros = async (req, resp = response) => {
  let { pagina = 1, registrosXpagina = 10, query = "" } = req.query;
  pagina = Number(pagina);
  registrosXpagina = Number(registrosXpagina);
  pagina = pagina > 0 ? pagina : 0;
  registrosXpagina = registrosXpagina > 0 ? registrosXpagina : 10;

  let consultas = [];
  if (query.length > 3) {
    let array = query.split(" ");
    consultas = array.map((contains) => {
      return {
        AND: [
          {
            OR: [
              { codigo: { contains } },
              { nombre: { contains } },
              { descripcion: { contains } }, 
            ],
          },
        ],
      };
    });
  }
  const where = { AND: [{ estado: "ACTIVO" }, ...consultas] }; 
  const total = await prisma.catalogo.count({ where });
  const registros = await prisma.catalogo.findMany({
    where,
    include: { Tipo: true, Categorias: true },
    take: registrosXpagina,
    skip: (pagina - 1) * registrosXpagina,
  });
  const totalFiltrado = await registros.length;
  resp.json({
    status: true,
    msg: "Listado de registros",
    total,
    totalFiltrado,
    pagina,
    registrosXpagina,
    registros,
  });
};
const  getRegistro = async (req = request, resp = response) => {
  let uid = Number(req.params.id);
  const registros = await prisma.catalogo.findFirst({
    where: { id_catalogo: uid, estado: "ACTIVO" },
    include: { Tipo: true, Categorias: true },
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
  let {
    id_tipo = 0,
    id_categoria = 0,
    codigo = "0000",
    nombre = "",
    descripcion = "",
    precio_con_iva = 0,
    precio_sin_iva = 0,
    existencias_minimas = 0,
    existencias_maximas = 0,
  } = req.body;
  try {
    const [tipo, categoria] = await Promise.all([
      await prisma.catalogoTipo.findFirst({
        where: { id_tipo },
      }),
      await prisma.catalogoCategorias.findFirst({
        where: { id_categoria },
      }),
    ]);
    if (!tipo) {
      return resp.status(400).json({
        status: false,
        msg: "El tipo no existe ",
      });
    }
    if (!categoria) {
      return resp.status(400).json({
        status: false,
        msg: "La categoria no existe",
      });
    }
    const data = await prisma.catalogo.create({
      data: {
        id_tipo,
        id_categoria,
        codigo,
        nombre,
        descripcion,
        precio_con_iva,
        precio_sin_iva,
        existencias_minimas,
        existencias_maximas
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
    const registro = await prisma.catalogo.findFirst({
      where: { id_catalogo: uid, estado: "ACTIVO" },
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    let {
      id_tipo = 0,
      id_categoria = 0,
      codigo = "0000",
      nombre = "",
      descripcion = "",
      precio_con_iva = 0,
      precio_sin_iva = 0, 
      existencias_minimas=0,
      existencias_maximas=0
    } = req.body;
    const [tipo, categoria] = await Promise.all([
      await prisma.catalogoTipo.findFirst({
        where: { id_tipo },
      }),
      await prisma.catalogoCategorias.findFirst({
        where: { id_categoria },
      }),
    ]);
    if (!tipo) {
      return resp.status(400).json({
        status: false,
        msg: "El tipo no existe ",
      });
    }
    if (!categoria) {
      return resp.status(400).json({
        status: false,
        msg: "La categoria no existe",
      });
    }
    const registroActualizado = await prisma.catalogo.update({
      where: { id_catalogo: uid },
      data: {
        id_tipo,
        id_categoria,
        codigo,
        nombre,
        descripcion,
        precio_con_iva,
        precio_sin_iva,
        existencias_minimas,
        existencias_maximas
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
    const registro = await prisma.catalogo.findFirst({
      where: { id_catalogo: uid, estado: "ACTIVO" },
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    await prisma.catalogo.update({
      data: { estado: "INACTIVO" },
      where: { id_catalogo: uid },
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

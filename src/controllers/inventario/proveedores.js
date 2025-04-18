const express = require("express");
const response = express.response;
const request = express.request;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { eliminarArchivoCloudinary, subirArchivo } = require("../utils");


const  getBancos = async (_, resp = response) => {
  var data = await prisma.bancos.findMany({
    where: {
      Estado: "ACTIVO"
    }
  });
  return resp.json({
    status: true,
    msg: "Listado de registros",
    data,
  });
}


const  getFacturasProveedores = async (req = request, resp = response) => {
  let id_proveedor = Number(req.params.id);
  var data = await prisma.compras.findMany({
    where: {
      id_proveedor
    },
    include: { Sucursales: true, FacturasTipos:true }
  });
  return resp.json({
    status: true,
    msg: "Listado de registros",
    data,
  });
}
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
              { nombre: { contains } },
              { giro: { contains } },
              { razon_social: { contains } },
              { registro_nrc: { contains } },
              { nit: { contains } },
              { direccion: { contains } },
              { dui: { contains } },
            ],
          },
        ],
      };
    });
  }
  const where = { AND: [{ estado: "ACTIVO" }, ...consultas] };
  const total = await prisma.proveedores.count({ where });
  const data = await prisma.proveedores.findMany({
    where,
    include: { Municipio: true, TipoProveedor: true },
    take: registrosXpagina,
    skip: (pagina - 1) * registrosXpagina,
  });
  const totalFiltrado = await data.length;
  resp.json({
    status: true,
    msg: "Listado de registros",
    total,
    totalFiltrado,
    pagina,
    registrosXpagina,
    data,
  });
};

const  getRegistro = async (req = request, resp = response) => {
  let uid = Number(req.params.id);
  const registros = await prisma.proveedores.findFirst({
    where: { id_proveedor: uid, estado: "ACTIVO" },
    include: {
      Municipio: { include: { Departamento: true } },
      TipoProveedor: true,
    },
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
    nombre = "",
    giro = "",
    razon_social = "",
    registro_nrc = "",
    nit = "",
    id_municipio = 0,
    dias_credito = 0,
    direccion = "",
    dui = "",
    nombre_contac_1 = "",
    telefono_contac_1 = "",
    correo_contac_1 = "",
    nombre_contac_2 = "",
    telefono_contac_2 = "",
    correo_contac_2 = "",
    nombre_contac_3 = "",
    telefono_contac_3 = "",
    correo_contac_3 = "",
    id_tipo_proveedor = 0,
    id_banco = 0,
    no_cuenta = "",
    tipo_cuenta = "",
  } = req.body;
  try {
    let { uid = 0 } = req.params;
    let id_usuario = Number(uid);
    id_municipio = Number(id_municipio);
    id_banco = Number(id_banco);
    id_tipo_proveedor = Number(id_tipo_proveedor);
    id_municipio = id_municipio > 0 ? id_municipio : null;
    id_banco = id_banco > 0 ? id_banco : null;
    id_tipo_proveedor = id_tipo_proveedor > 0 ? id_tipo_proveedor : null;

    let respImagen = {};
    if (req.files && Object.keys(req.files).length > 0) {
      respImagen = await subirArchivo(req.files);
    }
    let foto_obj_nrc = JSON.stringify(respImagen);
    let foto_url_nrc = respImagen.secure_url ? respImagen.secure_url : "";

    if (id_tipo_proveedor > 0) {
      const tipoCliente = await prisma.tiposCliente.findFirst({
        where: { id_tipo_cliente: id_tipo_proveedor },
      });
      if (!tipoCliente) {
        return resp.status(400).json({
          status: false,
          msg: "El tipo de cliente seleccionado no existe ",
        });
      }
    }

    if (id_municipio > 0) {
      const municipio = await prisma.municipios.findFirst({
        where: { id_municipio },
      });
      if (!municipio) {
        return resp.status(400).json({
          status: false,
          msg: "El municipio seleccionado no existe ",
        });
      }
    } else {
      id_municipio = null;
    }
    if (id_banco > 0) {
      const municipio = await prisma.bancos.findFirst({
        where: { id_banco },
      });
      if (!municipio) {
        return resp.status(400).json({
          status: false,
          msg: "El banco seleccionado no existe ",
        });
      }
    } else {
      id_banco = null;
    }

    const data = await prisma.proveedores.create({
      data: {
        nombre,
        giro,
        razon_social,
        registro_nrc,
        nit,
        id_municipio,
        direccion,
        dui,
        dias_credito,
        nombre_contac_1,
        telefono_contac_1,
        correo_contac_1,
        nombre_contac_2,
        telefono_contac_2,
        correo_contac_2,
        nombre_contac_3,
        telefono_contac_3,
        correo_contac_3,
        id_tipo_proveedor,
        foto_obj_nrc,
        foto_url_nrc,
        id_banco,
        no_cuenta,
        tipo_cuenta,
        id_usuario
      },
    });
    delete data.foto_obj_nrc;
    resp.json({
      status: true,
      msg: "Registro creado con Éxito",
      data,
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

const  actualizarRegistro = async (req = request, resp = response) => {
  let {
    nombre = "",
    giro = "",
    razon_social = "",
    registro_nrc = "",
    nit = "",
    id_municipio = 0,
    dias_credito = 0,
    direccion = "",
    dui = "",
    nombre_contac_1 = "",
    telefono_contac_1 = "",
    correo_contac_1 = "",
    nombre_contac_2 = "",
    telefono_contac_2 = "",
    correo_contac_2 = "",
    nombre_contac_3 = "",
    telefono_contac_3 = "",
    correo_contac_3 = "",
    id_tipo_proveedor = 0,

    id_banco = 0,
    no_cuenta = "",
    tipo_cuenta = "",
  } = req.body;
  try {
    let id_proveedor = Number(req.params.id);
    id_municipio = Number(id_municipio);
    id_tipo_proveedor = Number(id_tipo_proveedor);
    id_banco = Number(id_banco);
    id_municipio = id_municipio > 0 ? id_municipio : null;
    id_banco = id_banco > 0 ? id_banco : null;
    id_tipo_proveedor = id_tipo_proveedor > 0 ? id_tipo_proveedor : null;

    const registro = await prisma.proveedores.findFirst({
      where: { id_proveedor, estado: "ACTIVO" },
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    let foto_obj_nrc = registro.foto_obj_nrc;
    let foto_url_nrc = registro.foto_url_nrc;
    if (req.files && Object.keys(req.files).length > 0) {
      try {
        let respn = await subirArchivo(req.files);
        foto_url_nrc = respn.secure_url;
        foto_obj_nrc = JSON.stringify(respn);
        if (
          registro.foto_obj_nrc != "" &&
          registro.foto_obj_nrc != "{}" &&
          registro.foto_obj_nrc != null &&
          registro.foto_obj_nrc.length > 0
        ) {
          let imagenActual = JSON.parse(registro.foto_obj_nrc);
          await eliminarArchivoCloudinary(imagenActual.public_id);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (id_tipo_proveedor > 0) {
      const tipoCliente = await prisma.tiposCliente.findFirst({
        where: { id_tipo_cliente: id_tipo_proveedor },
      });
      if (!tipoCliente) {
        return resp.status(400).json({
          status: false,
          msg: "El tipo de cliente seleccionado no existe ",
        });
      }
    }

    if (id_municipio > 0) {
      const municipio = await prisma.municipios.findFirst({
        where: { id_municipio },
      });
      if (!municipio) {
        return resp.status(400).json({
          status: false,
          msg: "El municipio seleccionado no existe ",
        });
      }
    } else {
      id_municipio = null;
    }

    const data = await prisma.proveedores.update({
      where: { id_proveedor },
      data: {
        nombre,
        giro,
        razon_social,
        registro_nrc,
        nit,
        id_municipio,
        direccion,
        dui,
        dias_credito,
        nombre_contac_1,
        telefono_contac_1,
        correo_contac_1,
        nombre_contac_2,
        telefono_contac_2,
        correo_contac_2,
        nombre_contac_3,
        telefono_contac_3,
        correo_contac_3,
        id_tipo_proveedor,
        foto_obj_nrc,
        foto_url_nrc,
        id_banco,
        no_cuenta,
        tipo_cuenta,
      },
    });
    delete data.foto_obj_nrc;
    resp.json({
      status: true,
      msg: "Registro actualizado con Éxito",
      data,
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

const  eliminarRegistro = async (req = request, resp = response) => {
  let uid = Number(req.params.id);
  try {
    const registro = await prisma.proveedores.findFirst({
      where: { id_proveedor: uid, estado: "ACTIVO" },
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    await prisma.proveedores.update({
      data: { estado: "INACTIVO" },
      where: { id_proveedor: uid },
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
  getBancos,
  getFacturasProveedores,
  getRegistros,
  getRegistro,
  crearRegistro,
  actualizarRegistro,
  eliminarRegistro,
};
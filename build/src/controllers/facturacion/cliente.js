"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarRegistro = exports.actualizarRegistro = exports.crearRegistro = exports.getFacturas = exports.getRegistro = exports.getRegistros = void 0;
const express_1 = __importDefault(require("express"));
const response = express_1.default.response;
const request = express_1.default.request;
const client_1 = require("@prisma/client");
const utils_1 = require("../utils");
const prisma = new client_1.PrismaClient();
const getRegistros = (req, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
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
                            { telefono: { contains } },
                            { correo: { contains } },
                            { dui: { contains } },
                        ],
                    },
                ],
            };
        });
    }
    const where = { AND: [{ estado: "ACTIVO" }, ...consultas] };
    const total = yield prisma.cliente.count({ where });
    const data = yield prisma.cliente.findMany({
        where,
        include: { Municipio: true },
        take: registrosXpagina,
        skip: (pagina - 1) * registrosXpagina,
    });
    const totalFiltrado = yield data.length;
    resp.json({
        status: true,
        msg: "Listado de registros",
        total,
        totalFiltrado,
        pagina,
        registrosXpagina,
        data,
    });
});
exports.getRegistros = getRegistros;
const getRegistro = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let uid = Number(req.params.id);
    uid = uid > 0 ? uid : 0;
    const registros = yield prisma.cliente.findFirst({
        where: { id_cliente: uid, estado: "ACTIVO" },
        include: { Municipio: true },
    });
    if (!registros) {
        resp.status(400).json({
            status: false,
            msg: "El registro no existe",
        });
    }
    else {
        resp.json({
            status: true,
            msg: "Exito",
            registros,
        });
    }
});
exports.getRegistro = getRegistro;
const getFacturas = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let uid = Number(req.params.id);
    uid = uid > 0 ? uid : 0;
    const registros = yield prisma.cliente.findFirst({
        where: { id_cliente: uid, estado: "ACTIVO" },
        include: { Municipio: true },
    });
    if (!registros) {
        return resp.status(400).json({
            status: false,
            msg: "El registro no existe",
        });
    }
    const data = yield prisma.facturas.findMany({
        where: { id_cliente: uid },
        include: { Bloque: { include: { Tipo: true } } },
    });
    resp.json({
        status: true,
        msg: "Exito",
        data,
    });
    return;
});
exports.getFacturas = getFacturas;
const crearRegistro = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let { ids = 0 } = req.params;
    let id_sucursal = Number(ids);
    let { nombre = "", giro = "", razon_social = "", registro_nrc = "", nit = "", id_municipio = 0, direccion = "", telefono = "", correo = "", dui = "", } = req.body;
    try {
        let respImagen = {};
        if (req.files && Object.keys(req.files).length > 0) {
            respImagen = yield (0, utils_1.subirArchivo)(req.files);
        }
        let foto_obj_nrc = JSON.stringify(respImagen);
        let foto_url_nrc = respImagen.secure_url ? respImagen.secure_url : "";
        id_municipio = Number(id_municipio);
        if (id_municipio > 0) {
            const municipio = yield prisma.municipios.findFirst({
                where: { id_municipio },
            });
            if (!municipio) {
                return resp.status(400).json({
                    status: false,
                    msg: "El municipio seleccionado no existe ",
                });
            }
        }
        else {
            id_municipio = null;
        }
        const data = yield prisma.cliente.create({
            data: {
                nombre,
                giro,
                razon_social,
                registro_nrc,
                foto_url_nrc,
                foto_obj_nrc,
                nit,
                id_municipio,
                direccion,
                telefono,
                correo,
                dui,
                id_sucursal
            },
            select: {
                id_cliente: true,
                nombre: true,
                giro: true,
                razon_social: true,
                registro_nrc: true,
                foto_url_nrc: true,
                nit: true,
                Municipio: { include: { Departamento: true } },
                direccion: true,
                telefono: true,
                correo: true,
                dui: true,
            },
        });
        resp.json({
            status: true,
            msg: "Registro creado con Éxito",
            data,
        });
    }
    catch (error) {
        console.log(error);
        resp.status(500).json({
            status: false,
            msg: "Error inesperado reviosar log",
        });
    }
    return;
});
exports.crearRegistro = crearRegistro;
const actualizarRegistro = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let uid = Number(req.params.id);
    uid = uid > 0 ? uid : 0;
    try {
        const registro = yield prisma.cliente.findFirst({
            where: { id_cliente: uid, estado: "ACTIVO" },
        });
        if (!registro) {
            return resp.status(400).json({
                status: false,
                msg: "El registro no existe",
            });
        }
        let { nombre = "", giro = "", razon_social = "", nit = "", id_municipio = 0, direccion = "", telefono = "", correo = "", dui = "", registro_nrc = "", } = req.body;
        let foto_obj_nrc = registro.foto_obj_nrc;
        let foto_url_nrc = registro.foto_url_nrc;
        if (req.files && Object.keys(req.files).length > 0) {
            try {
                let respn = yield (0, utils_1.subirArchivo)(req.files);
                foto_url_nrc = respn.secure_url;
                foto_obj_nrc = JSON.stringify(respn);
                if (registro.foto_obj_nrc != "" &&
                    registro.foto_obj_nrc != "{}" &&
                    registro.foto_obj_nrc != null &&
                    registro.foto_obj_nrc.length > 0) {
                    let imagenActual = JSON.parse(registro.foto_obj_nrc);
                    yield (0, utils_1.eliminarArchivoCloudinary)(imagenActual.public_id);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        id_municipio = Number(id_municipio);
        if (id_municipio > 0) {
            const municipio = yield prisma.municipios.findFirst({
                where: { id_municipio },
            });
            if (!municipio) {
                return resp.status(400).json({
                    status: false,
                    msg: "El municipio seleccionado no existe ",
                });
            }
        }
        else {
            id_municipio = null;
        }
        const registroActualizado = yield prisma.cliente.update({
            where: { id_cliente: uid },
            data: {
                nombre,
                giro,
                razon_social,
                registro_nrc,
                nit,
                foto_url_nrc,
                foto_obj_nrc,
                id_municipio,
                direccion,
                telefono,
                correo,
                dui,
            },
            select: {
                id_cliente: true,
                nombre: true,
                giro: true,
                razon_social: true,
                Municipio: { include: { Departamento: true } },
                registro_nrc: true,
                nit: true,
                id_municipio: true,
                direccion: true,
                telefono: true,
                correo: true,
                dui: true,
            },
        });
        resp.json({
            status: true,
            msg: "Registro Actualizado",
            data: registroActualizado,
        });
    }
    catch (error) {
        console.log(error);
        resp.status(500).json({
            status: false,
            msg: "Error inesperado reviosar log",
        });
    }
    return;
});
exports.actualizarRegistro = actualizarRegistro;
const eliminarRegistro = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let uid = Number(req.params.id);
    uid = uid > 0 ? uid : 0;
    try {
        const registro = yield prisma.cliente.findFirst({
            where: { id_cliente: uid, estado: "ACTIVO" },
        });
        if (!registro) {
            return resp.status(400).json({
                status: false,
                msg: "El registro no existe",
            });
        }
        yield prisma.cliente.update({
            data: { estado: "INACTIVO" },
            where: { id_cliente: uid },
        });
        resp.json({
            status: true,
            msg: "Registro elimiando",
        });
    }
    catch (error) {
        console.log(error);
        resp.status(500).json({
            status: false,
            msg: "Error inesperado reviosar log",
        });
    }
    return;
});
exports.eliminarRegistro = eliminarRegistro;
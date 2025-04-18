const { PrismaClient } = require('@prisma/client');
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const execute = async () => {
  try {
    await prisma.facturasTipos.createMany({
      data: [
        { id_tipo_factura: 1, nombre: "Consumidor Final", codigo: "01" },
        { id_tipo_factura: 2, nombre: "Credito Fiscal", codigo: "03" },
        { id_tipo_factura: 3, nombre: "Recibo", codigo: "00" },
        { id_tipo_factura: 4, nombre: "Nota de crédito", codigo: "05" },
        { id_tipo_factura: 5, nombre: "Nota de débito", codigo: "06" },
      ],
    });

    await prisma.bancos.createMany({
      data: [
        { nombre: "Banco Agrícola" },
        { nombre: "Banco Cuscatlán " },
        { nombre: "Banco de América Central" },
        { nombre: "Banco Promerica" },
        { nombre: "Banco Davivienda" },
        { nombre: "Banco Hipotecario  " },
        { nombre: "Citi  " },
        { nombre: "Banco Procredit" },
        { nombre: "Banco Azul" },
        { nombre: "Banco G&T Continental" },
      ],
    });
    await prisma.tiposCliente.createMany({
      data: [
        { id_tipo_cliente: 1, nombre: "Grandes Contribuyentes" },
        { id_tipo_cliente: 2, nombre: "Medianos Contribuyentes" },
        { id_tipo_cliente: 3, nombre: "Otros Contribuyentes" },
      ],
    });
    await prisma.facturasMetodosDePago.createMany({
      data: [
        { nombre: "Efectivo" },
        { nombre: "Tarjeta" },
        { nombre: "Cheque" },
        { nombre: "Transferencia" },
        { nombre: "Mixto" },
        { nombre: "Credito" },
      ],
    });
    await prisma.departamentos.createMany({
      data: [
        { id_departamento: 1, nombre: "Ahuachapán", codigo_iso: "SV-AH" },
        { id_departamento: 2, nombre: "Santa Ana", codigo_iso: "SV-SA" },
        { id_departamento: 3, nombre: "Sonsonate", codigo_iso: "SV-SO" },
        { id_departamento: 4, nombre: "La Libertad", codigo_iso: "SV-LI" },
        { id_departamento: 5, nombre: "Chalatenango", codigo_iso: "SV-CH" },
        { id_departamento: 6, nombre: "San Salvador", codigo_iso: "SV-SS" },
        { id_departamento: 7, nombre: "Cuscatlán", codigo_iso: "SV-CU" },
        { id_departamento: 8, nombre: "La Paz", codigo_iso: "SV-PA" },
        { id_departamento: 9, nombre: "Cabañas", codigo_iso: "SV-CA" },
        { id_departamento: 10, nombre: "San Vicente", codigo_iso: "SV-SV" },
        { id_departamento: 11, nombre: "Usulután", codigo_iso: "SV-US" },
        { id_departamento: 12, nombre: "Morazán", codigo_iso: "SV-MO" },
        { id_departamento: 13, nombre: "San Miguel", codigo_iso: "SV-SM" },
        { id_departamento: 14, nombre: "La Unión", codigo_iso: "SV-UN" },
      ],
    });

    await prisma.municipios.createMany({
      data: [
        { id_municipio: 1, nombre: "Ahuachapán", id_departamento: 1 },
        { id_municipio: 2, nombre: "Jujutla", id_departamento: 1 },
        { id_municipio: 3, nombre: "Atiquizaya", id_departamento: 1 },
        { id_municipio: 4, nombre: "Concepción de Ataco", id_departamento: 1 },
        { id_municipio: 5, nombre: "El Refugio", id_departamento: 1 },
        { id_municipio: 6, nombre: "Guaymango", id_departamento: 1 },
        { id_municipio: 7, nombre: "Apaneca", id_departamento: 1 },
        {
          id_municipio: 8,
          nombre: "San Francisco Menéndez",
          id_departamento: 1,
        },
        { id_municipio: 9, nombre: "San Lorenzo", id_departamento: 1 },
        { id_municipio: 10, nombre: "San Pedro Puxtla", id_departamento: 1 },
        { id_municipio: 11, nombre: "Tacuba", id_departamento: 1 },
        { id_municipio: 12, nombre: "Turín", id_departamento: 1 },
        {
          id_municipio: 13,
          nombre: "Candelaria de la Frontera",
          id_departamento: 2,
        },
        { id_municipio: 14, nombre: "Chalchuapa", id_departamento: 2 },
        { id_municipio: 15, nombre: "Coatepeque", id_departamento: 2 },
        { id_municipio: 16, nombre: "El Congo", id_departamento: 2 },
        { id_municipio: 17, nombre: "El Porvenir", id_departamento: 2 },
        { id_municipio: 18, nombre: "Masahuat", id_departamento: 2 },
        { id_municipio: 19, nombre: "Metapán", id_departamento: 2 },
        { id_municipio: 20, nombre: "San Antonio Pajonal", id_departamento: 2 },
        {
          id_municipio: 21,
          nombre: "San Sebastián Salitrillo",
          id_departamento: 2,
        },
        { id_municipio: 22, nombre: "Santa Ana", id_departamento: 2 },
        {
          id_municipio: 23,
          nombre: "Santa Rosa Guachipilín",
          id_departamento: 2,
        },
        {
          id_municipio: 24,
          nombre: "Santiago de la Frontera",
          id_departamento: 2,
        },
        { id_municipio: 25, nombre: "Texistepeque", id_departamento: 2 },
        { id_municipio: 26, nombre: "Acajutla", id_departamento: 3 },
        { id_municipio: 27, nombre: "Armenia", id_departamento: 3 },
        { id_municipio: 28, nombre: "Caluco", id_departamento: 3 },
        { id_municipio: 29, nombre: "Cuisnahuat", id_departamento: 3 },
        { id_municipio: 30, nombre: "Izalco", id_departamento: 3 },
        { id_municipio: 31, nombre: "Juayúa", id_departamento: 3 },
        { id_municipio: 32, nombre: "Nahuizalco", id_departamento: 3 },
        { id_municipio: 33, nombre: "Nahulingo", id_departamento: 3 },
        { id_municipio: 34, nombre: "Salcoatitán", id_departamento: 3 },
        {
          id_municipio: 35,
          nombre: "San Antonio del Monte",
          id_departamento: 3,
        },
        { id_municipio: 36, nombre: "San Julián", id_departamento: 3 },
        {
          id_municipio: 37,
          nombre: "Santa Catarina Masahuat",
          id_departamento: 3,
        },
        {
          id_municipio: 38,
          nombre: "Santa Isabel Ishuatán",
          id_departamento: 3,
        },
        {
          id_municipio: 39,
          nombre: "Santo Domingo de Guzmán",
          id_departamento: 3,
        },
        { id_municipio: 40, nombre: "Sonsonate", id_departamento: 3 },
        { id_municipio: 41, nombre: "Sonzacate", id_departamento: 3 },
        { id_municipio: 42, nombre: "Alegría", id_departamento: 11 },
        { id_municipio: 43, nombre: "Berlín", id_departamento: 11 },
        { id_municipio: 44, nombre: "California", id_departamento: 11 },
        { id_municipio: 45, nombre: "Concepción Batres", id_departamento: 11 },
        { id_municipio: 46, nombre: "El Triunfo", id_departamento: 11 },
        { id_municipio: 47, nombre: "Ereguayquín", id_departamento: 11 },
        { id_municipio: 48, nombre: "Estanzuelas", id_departamento: 11 },
        { id_municipio: 49, nombre: "Jiquilisco", id_departamento: 11 },
        { id_municipio: 50, nombre: "Jucuapa", id_departamento: 11 },
        { id_municipio: 51, nombre: "Jucuarán", id_departamento: 11 },
        { id_municipio: 52, nombre: "Mercedes Umaña", id_departamento: 11 },
        { id_municipio: 53, nombre: "Nueva Granada", id_departamento: 11 },
        { id_municipio: 54, nombre: "Ozatlán", id_departamento: 11 },
        { id_municipio: 55, nombre: "Puerto El Triunfo", id_departamento: 11 },
        { id_municipio: 56, nombre: "San Agustín", id_departamento: 11 },
        { id_municipio: 57, nombre: "San Buenaventura", id_departamento: 11 },
        { id_municipio: 58, nombre: "San Dionisio", id_departamento: 11 },
        {
          id_municipio: 59,
          nombre: "San Francisco Javier",
          id_departamento: 11,
        },
        { id_municipio: 60, nombre: "Santa Elena", id_departamento: 11 },
        { id_municipio: 61, nombre: "Santa María", id_departamento: 11 },
        { id_municipio: 62, nombre: "Santiago de María", id_departamento: 11 },
        { id_municipio: 63, nombre: "Tecapán", id_departamento: 11 },
        { id_municipio: 64, nombre: "Usulután", id_departamento: 11 },
        { id_municipio: 65, nombre: "Carolina", id_departamento: 13 },
        { id_municipio: 66, nombre: "Chapeltique", id_departamento: 13 },
        { id_municipio: 67, nombre: "Chinameca", id_departamento: 13 },
        { id_municipio: 68, nombre: "Chirilagua", id_departamento: 13 },
        { id_municipio: 69, nombre: "Ciudad Barrios", id_departamento: 13 },
        { id_municipio: 70, nombre: "Comacarán", id_departamento: 13 },
        { id_municipio: 71, nombre: "El Tránsito", id_departamento: 13 },
        { id_municipio: 72, nombre: "Lolotique", id_departamento: 13 },
        { id_municipio: 73, nombre: "Moncagua", id_departamento: 13 },
        { id_municipio: 74, nombre: "Nueva Guadalupe", id_departamento: 13 },
        {
          id_municipio: 75,
          nombre: "Nuevo Edén de San Juan",
          id_departamento: 13,
        },
        { id_municipio: 76, nombre: "Quelepa", id_departamento: 13 },
        {
          id_municipio: 77,
          nombre: "San Antonio del Mosco",
          id_departamento: 13,
        },
        { id_municipio: 78, nombre: "San Gerardo", id_departamento: 13 },
        { id_municipio: 79, nombre: "San Jorge", id_departamento: 13 },
        {
          id_municipio: 80,
          nombre: "San Luis de la Reina",
          id_departamento: 13,
        },
        { id_municipio: 81, nombre: "San Miguel", id_departamento: 13 },
        { id_municipio: 82, nombre: "San Rafael Oriente", id_departamento: 13 },
        { id_municipio: 83, nombre: "Sesori", id_departamento: 13 },
        { id_municipio: 84, nombre: "Uluazapa", id_departamento: 13 },
        { id_municipio: 85, nombre: "Arambala", id_departamento: 12 },
        { id_municipio: 86, nombre: "Cacaopera", id_departamento: 12 },
        { id_municipio: 87, nombre: "Chilanga", id_departamento: 12 },
        { id_municipio: 88, nombre: "Corinto", id_departamento: 12 },
        {
          id_municipio: 89,
          nombre: "Delicias de Concepción",
          id_departamento: 12,
        },
        { id_municipio: 90, nombre: "El Divisadero", id_departamento: 12 },
        {
          id_municipio: 91,
          nombre: "El Rosario (Morazán)",
          id_departamento: 12,
        },
        { id_municipio: 92, nombre: "Gualococti", id_departamento: 12 },
        { id_municipio: 93, nombre: "Guatajiagua", id_departamento: 12 },
        { id_municipio: 94, nombre: "Joateca", id_departamento: 12 },
        { id_municipio: 95, nombre: "Jocoaitique", id_departamento: 12 },
        { id_municipio: 96, nombre: "Jocoro", id_departamento: 12 },
        { id_municipio: 97, nombre: "Lolotiquillo", id_departamento: 12 },
        { id_municipio: 98, nombre: "Meanguera", id_departamento: 12 },
        { id_municipio: 99, nombre: "Osicala", id_departamento: 12 },
        { id_municipio: 100, nombre: "Perquín", id_departamento: 12 },
        { id_municipio: 101, nombre: "San Carlos", id_departamento: 12 },
        {
          id_municipio: 102,
          nombre: "San Fernando (Morazán)",
          id_departamento: 12,
        },
        {
          id_municipio: 103,
          nombre: "San Francisco Gotera",
          id_departamento: 12,
        },
        {
          id_municipio: 104,
          nombre: "San Isidro (Morazán)",
          id_departamento: 12,
        },
        { id_municipio: 105, nombre: "San Simón", id_departamento: 12 },
        { id_municipio: 106, nombre: "Sensembra", id_departamento: 12 },
        { id_municipio: 107, nombre: "Sociedad", id_departamento: 12 },
        { id_municipio: 108, nombre: "Torola", id_departamento: 12 },
        { id_municipio: 109, nombre: "Yamabal", id_departamento: 12 },
        { id_municipio: 110, nombre: "Yoloaiquín", id_departamento: 12 },
        { id_municipio: 111, nombre: "La Unión", id_departamento: 14 },
        { id_municipio: 112, nombre: "San Alejo", id_departamento: 14 },
        { id_municipio: 113, nombre: "Yucuaiquín", id_departamento: 14 },
        { id_municipio: 114, nombre: "Conchagua", id_departamento: 14 },
        { id_municipio: 115, nombre: "Intipucá", id_departamento: 14 },
        { id_municipio: 116, nombre: "San José", id_departamento: 14 },
        {
          id_municipio: 117,
          nombre: "El Carmen (La Unión)",
          id_departamento: 14,
        },
        { id_municipio: 118, nombre: "Yayantique", id_departamento: 14 },
        { id_municipio: 119, nombre: "Bolívar", id_departamento: 14 },
        {
          id_municipio: 120,
          nombre: "Meanguera del Golfo",
          id_departamento: 14,
        },
        {
          id_municipio: 121,
          nombre: "Santa Rosa de Lima",
          id_departamento: 14,
        },
        { id_municipio: 122, nombre: "Pasaquina", id_departamento: 14 },
        { id_municipio: 123, nombre: "Anamoros", id_departamento: 14 },
        { id_municipio: 124, nombre: "Nueva Esparta", id_departamento: 14 },
        { id_municipio: 125, nombre: "El Sauce", id_departamento: 14 },
        {
          id_municipio: 126,
          nombre: "Concepción de Oriente",
          id_departamento: 14,
        },
        { id_municipio: 127, nombre: "Polorós", id_departamento: 14 },
        { id_municipio: 128, nombre: "Lislique", id_departamento: 14 },
        { id_municipio: 129, nombre: "Antiguo Cuscatlán", id_departamento: 4 },
        { id_municipio: 130, nombre: "Chiltiupán", id_departamento: 4 },
        { id_municipio: 131, nombre: "Ciudad Arce", id_departamento: 4 },
        { id_municipio: 132, nombre: "Colón", id_departamento: 4 },
        { id_municipio: 133, nombre: "Comasagua", id_departamento: 4 },
        { id_municipio: 134, nombre: "Huizúcar", id_departamento: 4 },
        { id_municipio: 135, nombre: "Jayaque", id_departamento: 4 },
        { id_municipio: 136, nombre: "Jicalapa", id_departamento: 4 },
        { id_municipio: 137, nombre: "La Libertad", id_departamento: 4 },
        { id_municipio: 138, nombre: "Santa Tecla", id_departamento: 4 },
        { id_municipio: 139, nombre: "Nuevo Cuscatlán", id_departamento: 4 },
        { id_municipio: 140, nombre: "San Juan Opico", id_departamento: 4 },
        { id_municipio: 141, nombre: "Quezaltepeque", id_departamento: 4 },
        { id_municipio: 142, nombre: "Sacacoyo", id_departamento: 4 },
        {
          id_municipio: 143,
          nombre: "San José Villanueva",
          id_departamento: 4,
        },
        { id_municipio: 144, nombre: "San Matías", id_departamento: 4 },
        {
          id_municipio: 145,
          nombre: "San Pablo Tacachico",
          id_departamento: 4,
        },
        { id_municipio: 146, nombre: "Talnique", id_departamento: 4 },
        { id_municipio: 147, nombre: "Tamanique", id_departamento: 4 },
        { id_municipio: 148, nombre: "Teotepeque", id_departamento: 4 },
        { id_municipio: 149, nombre: "Tepecoyo", id_departamento: 4 },
        { id_municipio: 150, nombre: "Zaragoza", id_departamento: 4 },
        { id_municipio: 151, nombre: "Agua Caliente", id_departamento: 5 },
        { id_municipio: 152, nombre: "Arcatao", id_departamento: 5 },
        { id_municipio: 153, nombre: "Azacualpa", id_departamento: 5 },
        { id_municipio: 154, nombre: "Cancasque", id_departamento: 5 },
        { id_municipio: 155, nombre: "Chalatenango", id_departamento: 5 },
        { id_municipio: 156, nombre: "Citalá", id_departamento: 5 },
        { id_municipio: 157, nombre: "Comapala", id_departamento: 5 },
        {
          id_municipio: 158,
          nombre: "Concepción Quezaltepeque",
          id_departamento: 5,
        },
        {
          id_municipio: 159,
          nombre: "Dulce Nombre de María",
          id_departamento: 5,
        },
        { id_municipio: 160, nombre: "El Carrizal", id_departamento: 5 },
        { id_municipio: 161, nombre: "El Paraíso", id_departamento: 5 },
        { id_municipio: 162, nombre: "La Laguna", id_departamento: 5 },
        { id_municipio: 163, nombre: "La Palma", id_departamento: 5 },
        { id_municipio: 164, nombre: "La Reina", id_departamento: 5 },
        { id_municipio: 165, nombre: "Las Vueltas", id_departamento: 5 },
        { id_municipio: 166, nombre: "Nueva Concepción", id_departamento: 5 },
        { id_municipio: 167, nombre: "Nueva Trinidad", id_departamento: 5 },
        { id_municipio: 168, nombre: "Nombre de Jesús", id_departamento: 5 },
        { id_municipio: 169, nombre: "Ojos de Agua", id_departamento: 5 },
        { id_municipio: 170, nombre: "Potonico", id_departamento: 5 },
        {
          id_municipio: 171,
          nombre: "San Antonio de la Cruz",
          id_departamento: 5,
        },
        {
          id_municipio: 172,
          nombre: "San Antonio Los Ranchos",
          id_departamento: 5,
        },
        {
          id_municipio: 173,
          nombre: "San Fernando (Chalatenango)",
          id_departamento: 5,
        },
        {
          id_municipio: 174,
          nombre: "San Francisco Lempa",
          id_departamento: 5,
        },
        {
          id_municipio: 175,
          nombre: "San Francisco Morazán",
          id_departamento: 5,
        },
        { id_municipio: 176, nombre: "San Ignacio", id_departamento: 5 },
        {
          id_municipio: 177,
          nombre: "San Isidro Labrador",
          id_departamento: 5,
        },
        { id_municipio: 178, nombre: "Las Flores", id_departamento: 5 },
        {
          id_municipio: 179,
          nombre: "San Luis del Carmen",
          id_departamento: 5,
        },
        {
          id_municipio: 180,
          nombre: "San Miguel de Mercedes",
          id_departamento: 5,
        },
        { id_municipio: 181, nombre: "San Rafael", id_departamento: 5 },
        { id_municipio: 182, nombre: "Santa Rita", id_departamento: 5 },
        { id_municipio: 183, nombre: "Tejutla", id_departamento: 5 },
        { id_municipio: 184, nombre: "Cojutepeque", id_departamento: 7 },
        { id_municipio: 185, nombre: "Candelaria", id_departamento: 7 },
        {
          id_municipio: 186,
          nombre: "El Carmen (Cuscatlán)",
          id_departamento: 7,
        },
        {
          id_municipio: 187,
          nombre: "El Rosario (Cuscatlán)",
          id_departamento: 7,
        },
        { id_municipio: 188, nombre: "Monte San Juan", id_departamento: 7 },
        {
          id_municipio: 189,
          nombre: "Oratorio de Concepción",
          id_departamento: 7,
        },
        {
          id_municipio: 190,
          nombre: "San Bartolomé Perulapía",
          id_departamento: 7,
        },
        { id_municipio: 191, nombre: "San Cristóbal", id_departamento: 7 },
        { id_municipio: 192, nombre: "San José Guayabal", id_departamento: 7 },
        {
          id_municipio: 193,
          nombre: "San Pedro Perulapán",
          id_departamento: 7,
        },
        { id_municipio: 194, nombre: "San Rafael Cedros", id_departamento: 7 },
        { id_municipio: 195, nombre: "San Ramón", id_departamento: 7 },
        {
          id_municipio: 196,
          nombre: "Santa Cruz Analquito",
          id_departamento: 7,
        },
        { id_municipio: 197, nombre: "Santa Cruz Michapa", id_departamento: 7 },
        { id_municipio: 198, nombre: "Suchitoto", id_departamento: 7 },
        { id_municipio: 199, nombre: "Tenancingo", id_departamento: 7 },
        { id_municipio: 200, nombre: "Aguilares", id_departamento: 6 },
        { id_municipio: 201, nombre: "Apopa", id_departamento: 6 },
        { id_municipio: 202, nombre: "Ayutuxtepeque", id_departamento: 6 },
        { id_municipio: 203, nombre: "Cuscatancingo", id_departamento: 6 },
        { id_municipio: 204, nombre: "Ciudad Delgado", id_departamento: 6 },
        { id_municipio: 205, nombre: "El Paisnal", id_departamento: 6 },
        { id_municipio: 206, nombre: "Guazapa", id_departamento: 6 },
        { id_municipio: 207, nombre: "Ilopango", id_departamento: 6 },
        { id_municipio: 208, nombre: "Mejicanos", id_departamento: 6 },
        { id_municipio: 209, nombre: "Nejapa", id_departamento: 6 },
        { id_municipio: 210, nombre: "Panchimalco", id_departamento: 6 },
        { id_municipio: 211, nombre: "Rosario de Mora", id_departamento: 6 },
        { id_municipio: 212, nombre: "San Marcos", id_departamento: 6 },
        { id_municipio: 213, nombre: "San Martín", id_departamento: 6 },
        { id_municipio: 214, nombre: "San Salvador", id_departamento: 6 },
        {
          id_municipio: 215,
          nombre: "Santiago Texacuangos",
          id_departamento: 6,
        },
        { id_municipio: 216, nombre: "Santo Tomás", id_departamento: 6 },
        { id_municipio: 217, nombre: "Soyapango", id_departamento: 6 },
        { id_municipio: 218, nombre: "Tonacatepeque", id_departamento: 6 },
        { id_municipio: 219, nombre: "Zacatecoluca", id_departamento: 8 },
        { id_municipio: 220, nombre: "Cuyultitán", id_departamento: 8 },
        {
          id_municipio: 221,
          nombre: "El Rosario (La Paz)",
          id_departamento: 8,
        },
        { id_municipio: 222, nombre: "Jerusalén", id_departamento: 8 },
        { id_municipio: 223, nombre: "Mercedes La Ceiba", id_departamento: 8 },
        { id_municipio: 224, nombre: "Olocuilta", id_departamento: 8 },
        { id_municipio: 225, nombre: "Paraíso de Osorio", id_departamento: 8 },
        {
          id_municipio: 226,
          nombre: "San Antonio Masahuat",
          id_departamento: 8,
        },
        { id_municipio: 227, nombre: "San Emigdio", id_departamento: 8 },
        {
          id_municipio: 228,
          nombre: "San Francisco Chinameca",
          id_departamento: 8,
        },
        { id_municipio: 229, nombre: "San Pedro Masahuat", id_departamento: 8 },
        { id_municipio: 230, nombre: "San Juan Nonualco", id_departamento: 8 },
        { id_municipio: 231, nombre: "San Juan Talpa", id_departamento: 8 },
        {
          id_municipio: 232,
          nombre: "San Juan Tepezontes",
          id_departamento: 8,
        },
        {
          id_municipio: 233,
          nombre: "San Luis La Herradura",
          id_departamento: 8,
        },
        { id_municipio: 234, nombre: "San Luis Talpa", id_departamento: 8 },
        {
          id_municipio: 235,
          nombre: "San Miguel Tepezontes",
          id_departamento: 8,
        },
        { id_municipio: 236, nombre: "San Pedro Nonualco", id_departamento: 8 },
        {
          id_municipio: 237,
          nombre: "San Rafael Obrajuelo",
          id_departamento: 8,
        },
        { id_municipio: 238, nombre: "Santa María Ostuma", id_departamento: 8 },
        { id_municipio: 239, nombre: "Santiago Nonualco", id_departamento: 8 },
        { id_municipio: 240, nombre: "Tapalhuaca", id_departamento: 8 },
        { id_municipio: 241, nombre: "Cinquera", id_departamento: 9 },
        { id_municipio: 242, nombre: "Dolores", id_departamento: 9 },
        { id_municipio: 243, nombre: "Guacotecti", id_departamento: 9 },
        { id_municipio: 244, nombre: "Ilobasco", id_departamento: 9 },
        { id_municipio: 245, nombre: "Jutiapa", id_departamento: 9 },
        {
          id_municipio: 246,
          nombre: "San Isidro (Cabañas)",
          id_departamento: 9,
        },
        { id_municipio: 247, nombre: "Sensuntepeque", id_departamento: 9 },
        { id_municipio: 248, nombre: "Tejutepeque", id_departamento: 9 },
        { id_municipio: 249, nombre: "Victoria", id_departamento: 9 },
        { id_municipio: 250, nombre: "Apastepeque", id_departamento: 10 },
        { id_municipio: 251, nombre: "Guadalupe", id_departamento: 10 },
        {
          id_municipio: 252,
          nombre: "San Cayetano Istepeque",
          id_departamento: 10,
        },
        {
          id_municipio: 253,
          nombre: "San Esteban Catarina",
          id_departamento: 10,
        },
        { id_municipio: 254, nombre: "San Ildefonso", id_departamento: 10 },
        { id_municipio: 255, nombre: "San Lorenzo", id_departamento: 10 },
        { id_municipio: 256, nombre: "San Sebastián", id_departamento: 10 },
        { id_municipio: 257, nombre: "San Vicente", id_departamento: 10 },
        { id_municipio: 258, nombre: "Santa Clara", id_departamento: 10 },
        { id_municipio: 259, nombre: "Santo Domingo", id_departamento: 10 },
        { id_municipio: 260, nombre: "Tecoluca", id_departamento: 10 },
        { id_municipio: 261, nombre: "Tepetitán", id_departamento: 10 },
        { id_municipio: 262, nombre: "Verapaz", id_departamento: 10 },
      ],
    });

    await prisma.catalogoCategorias.createMany({
      data: [{ nombre: "Categoria 1" }, { nombre: "Categoria 2" }],
    });
    await prisma.catalogoTipo.createMany({
      data: [{ nombre: "Servicio" }, { nombre: "Producto" }],
    });


    //MOTIVOS DEMO
    await prisma.motivoSalida.createMany({
      data: [
        { nombre: "Roto" },
        { nombre: "Dañado" },
        { nombre: "Vendido" },
        { nombre: "Regalado" },
        { nombre: "Obsequiado" },
      ]
    });

    //SUCURSAL DEMO
    await prisma.sucursales.createMany({
      data: [
        { nombre: "Sucursal 1" },
        { nombre: "Sucursal 2" },
        { nombre: "Sucursal 3" },
        { nombre: "Sucursal 4" },
        { nombre: "Sucursal 5" },
      ]
    });


    await prisma.cliente.create({
      data: {
        nombre: "Varios",
        giro: "N/A",
        razon_social: "N/A",
        registro_nrc: "N/A",
        foto_url_nrc: null,
        foto_obj_nrc: null,
        nit: "N/A",
        id_municipio: null,
        direccion: "N/A",
        telefono: "N/A",
        correo: "N/A",
        dui: "N/A",
        id_sucursal: null,
        id_tipo_cliente: 2
      },
    });
    //ROLS DEMO
    await prisma.roles.createMany({
      data: [
        { nombre: "Admin", },
        { nombre: "Reservas", },
      ]
    });

    //USUARIO DEMO
    const salt = bcrypt.genSaltSync();
    let password = bcrypt.hashSync("1234", salt);

    await prisma.usuarios.create({
      data: {
        nombres: "Usuario",
        apellidos: "Demo",
        usuario: "usuario@demo.com",
        dui: "1234567890",
        password: password,
        id_rol: 1,//1,//testertkiero@gmail.com Tkiero2022.
        id_sucursal: 1,
        id_sucursal_reser: 1
      },
    });
    await prisma.usuarios.create({
      data: {
        nombres: "Usuario",
        apellidos: "Demo",
        usuario: "miguelmunoz_19@hotmail.es",
        dui: "1234567890",
        password: password,
        id_rol: 1,
        id_sucursal: 2,
      },
    });
    await prisma.usuarios.create({
      data: {
        nombres: "Usuario",
        apellidos: "Demo",
        usuario: "palomo_naza@yahoo.com",
        dui: "1234567890",
        password: password,
        id_rol: 1,
        id_sucursal: 3,
      },
    });

    await prisma.usuarios.create({
      data: {
        nombres: "Usuario",
        apellidos: "Demo",
        usuario: "balcaceressteven@gmail.com",
        dui: "1234567890",
        password: password,
        id_rol: 1,
        id_sucursal: 4,
      },
    });
    await prisma.usuarios.create({
      data: {
        nombres: "Usuario",
        apellidos: "Demo",
        usuario: "giovanniartiga@yahoo.com",
        dui: "1234567890",
        password: password,
        id_rol: 1,
        id_sucursal: 5,
      },
    });



    await prisma.generalData.create({
      data: {
        nombre_sistema: "Sistema Administrativo",
        impuesto: 0.13,
        direccion: "San Salvador",
        razon: "Razon",
        nit: "123456789",
        nrc: "1234",
        contactos: "234567890",
      },
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};
execute();

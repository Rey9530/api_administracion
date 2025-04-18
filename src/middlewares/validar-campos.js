const express = require("express");
const { validationResult } = require( "express-validator");

 validarCampos = (
  req,
  resp,
  next
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return resp.status(400).json({
      status: true,
      msg: "Error de parametros",
      errors: errors.mapped(),
    });
  }
  next();
  return;
};

 validar_dato = (
  valor,
  tipo
) => {
  if (valor === undefined || valor === null) {
    return false;
  }
  if (tipo == "positivo") {
    return parseInt(valor) > 0 ? true : false;
  }
  if (tipo == "positivo_0") {
    return parseInt(valor) >= 0 ? true : false;
  }
  if (tipo == "positivo_decimal") {
    return parseFloat(valor) > 0 ? true : false;
  }
  if (tipo == "is_array") {
    return Array.isArray(valor) && valor.length > 0 ? true : false;
  }
  return true;
};

module.exports = {
  validarCampos,
  validar_dato,
};
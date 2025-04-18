
// import expres from "express";
// const response = expres.response;
// const request = expres.request;
const express = require("express");
const response = express.response;
const request = express.request;
const jwt = require("jsonwebtoken");

validarJWT = (req = request, resp = response, next) => {
  const token = req.header("accessToken");
  if (!token) {
    return resp.status(401).json({
      status: false,
      msg: "No se detecta el accessToken",
    });
  } 
  // TODO: Aqui agregar la sentencia que guarda en bitacora
  // console.log(req.baseUrl+req.url); 
  try {
    const { uid, ids } = jwt.verify(
      token,
      process.env.JWT_SECRET || "1234"
    );
    req.params.uid = uid;
    req.params.ids = ids;
    next();
  } catch (error) {
    return resp.status(401).json({
      status: false,
      msg: "No se detecta el accessToken",
    });
  }
};

module.exports = {
  validarJWT,
};
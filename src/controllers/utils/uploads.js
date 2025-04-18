
const express = require('express');
const response = express.response;
const request = express.request;
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const cloud = require('cloudinary');
const cloudinary = cloud.v2;

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

 
const  borrarImage = (pathViejo)=>{  
    if(fs.existsSync(pathViejo)){
        fs.unlinkSync(pathViejo); 
    }
}  

const  subirArchivo = async (file) => {
  if (!file || Object.keys(file).length === 0) {
    return false;
  }

  const file_ = file.files;
  const nombreCortado = file_.name.split(".");
  const extencion = nombreCortado[nombreCortado.length - 1];

  let extencionesValidad = ["png", "jpg", "jpeg"];
  if (!extencionesValidad.includes(extencion)) {
    return "Extencion incorrecta";
  }
  const nombreArchivo = `${uuidv4()}.${extencion}`;
  const path = `./uploads/${nombreArchivo}`;

  return new Promise((resolve, _) => {
    file_.mv(path, function (err) {
      if (err) {
        console.log(err);
      } else {
        cloudinary.uploader.upload(path).then((result) => {
          borrarImage(path);
          resolve(result);
        });
      }
    });
  }).then((resp) => {
    return resp;
  });
};
 

const  eliminarArchivoCloudinary = (public_id) => {
  return new Promise((resolve, _) => {
    cloudinary.uploader.destroy(public_id).then((result) => { 
      resolve(result);
    });
  }).then((resp) => { 
    return resp;
  });
};
  

const  getArchivo = async (req = request, resp = response) => {
  const tipo = req.params.tipo;
  const img = req.params.img;
  const path = pathh.join(__dirname, `../uploads/${tipo}/${img}`);
  if (fs.existsSync(path)) {
    resp.sendFile(path);
  } else {
    const path = pathh.join(__dirname, `../uploads/no-img.jpg`);
    resp.sendFile(path);
  }
};
 
module.exports = {
  subirArchivo,
  getArchivo,
  eliminarArchivoCloudinary,
};
const jwt = require('jsonwebtoken');

const getenerarJWT = (uid, ids = 0) => {
    return new Promise( ( resolve, reject )=>{
        const payload = {
            uid,ids
        }
        jwt.sign(payload, process.env.JWT_SECRET || "1234",{
            expiresIn:'12h'
        }, (err, token)=>{
            if(err){
                console.log(err)
                reject(err);
            }else{
                resolve(token);
            }
        }); 
    });  
} 
module.exports = {
    getenerarJWT
}
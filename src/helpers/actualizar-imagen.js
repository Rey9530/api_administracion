
const fs = require('fs')
module.exports = borrarImage = (pathViejo)=>{  
    if(fs.existsSync(pathViejo)){
        fs.unlinkSync(pathViejo); 
    }
}  
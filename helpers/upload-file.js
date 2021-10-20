const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = (files, extensions = ['png','jpg','jpeg','gif'], collection = '') => {
    return new Promise((resolve, reject) => {
        const {file} = files;
        const nameSplit = file.name.split('.');
        const extension = nameSplit[nameSplit.length - 1];
    
        // Validate extension
        const allowedExtensions = extensions;
        if(!allowedExtensions.includes(extension)) {
            return  reject(`Extension .${extension} not allowed`);
        }
    
        const tempName = `${uuidv4()}.${extension}`;
        const uploadPath = path.join(__dirname, `../uploads/${collection}`, tempName);
      
        file.mv(uploadPath, (err) => {
          if (err) {
            return reject('Unexpected error');
          }

          resolve(tempName);
        });
    })    
}

module.exports = {
    uploadFile
}

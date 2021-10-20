const dbValidators = require('./db-validators');   
const generateJWT = require('./jwt') ;   
const uploadFile = require('./upload-file');   

module.exports = {
    ...dbValidators,
    ...generateJWT,
    ...uploadFile
}

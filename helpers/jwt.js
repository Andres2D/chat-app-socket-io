const jwt = require('jsonwebtoken');
const { User } = require('../models/index');

const generateJWT = ( uid = '' ) => {
    return new Promise( (resolve, reject) => {
        const payload = {uid};
        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if(err) {
                console.log(err);
                reject('Error generating the JWT');
            } else {
                resolve(token);
            }
        });
    });
}

const checkJWT = async(token = '') => {
    try {
        if(token.length < 10) {
            return null;
        }
        const {uid} = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(uid);

        if(user) {
            if(user.status) {
                return user;
            }else{
                return null;
            }
        }else{
            return null;
        }


    }catch(err) {
        console.log(err);
        return null;
    }
}

module.exports = {
    generateJWT,
    checkJWT
}

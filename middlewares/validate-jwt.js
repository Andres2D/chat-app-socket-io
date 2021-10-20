const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const { findById } = require('../models/user');
const User = require('../models/user');

const validateJWT = async(req = request, res = response, next) => {
    
    const token = req.header('x-token');

    try {
        if(!token) {
            return res.status(401).json({
                ok: false,
                msg: 'The token is required'
            });
        }

        const {uid} = jwt.verify(token, process.env.SECRET_KEY);
        // get the user that send the request
        const user = await User.findById(uid);

        // Validate if user auth exist
        if(!user) {
            return res.status(401).json({
                ok: false,
                msg: 'Invalid token - user not found'
            })
        }

        // Verfy if the user is not deleted
        if(!user.status) {
            return res.status(401).json({
                ok: false,
                msg: 'Invalid token - user with status false'
            })
        }


        req.user = user;

        next();

    }catch(err) {
        console.log(err);
        res.status(401).json({
            ok: false,
            msg: 'Invalid token'
        })
    }
}

module.exports = {
    validateJWT
}

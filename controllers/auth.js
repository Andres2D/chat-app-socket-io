
const { response } = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');
const { googleVerify } = require('../middlewares/google-verify');

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verify if the email exist
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({
                ok: false,
                msg: 'User / Password are invalid - email'
            });
        }

        // Verify if the user is active
        if(!user.status) {
            return res.status(400).json({
                ok: false,
                msg: 'User / Password are invalid - status: false'
            });
        }

        // Verify the password
        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'User / Password are invalid - password'
            });
        }

        // Generate JWT
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            user,
            token
        });

    }catch(ex) {
        console.log(ex);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        });
    }
}

const googleSignIn = async(req, res = response) => {
    const { id_token } = req.body;

    try {
        const {name, img, email} = await googleVerify(id_token);
        let user = await User.findOne({email});
        
        if(!user) {
            // Create new user
            const data = {
                name,
                email,
                google: true,
                password: ':P',
                img,
                role: 'USER_ROLE'
            };

            user = new User(data);
            await user.save();
        }

        // If the user is on DB
        if(!user.status) {
            return res.status(401).json({
                ok: false,
                msg: 'User blocked'
            })
        }

        // Generate JWT
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            user,
            token
        })
    }catch(err){
        console.log(err);
        res.status(400).json({
            ok: false,
            msg: 'The token can´t be verified'
        })
    }
}

module.exports = {
    login,
    googleSignIn
}

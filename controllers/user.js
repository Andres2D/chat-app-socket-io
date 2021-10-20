const { response, request } = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

const usersGet = async(req = request, res = response) => {

    // const { q, name = 'No name', apikey, page = 1, limit } = req.query;
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        ok: true,
        total,
        users
    });
}

const usersPut = async(req, res = response) => {

    const id = req.params.id;
    const { _id, password, google, email, ...user } = req.body;

    // TODO: validate agains db

    if(password) {
        // Has password
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);
    }

    const userBD = await User.findByIdAndUpdate(id, user);

    res.json({
        ok: true,
        userBD
    });
}

const usersPost = async(req, res = response) => {

    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    try {
        // Has password
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);
    
        // Save on DB
        await user.save();
        res.status(201).json({
            user
        });
    }catch(err) {
        res.status(500).json({
            ok: false,
            msg: 'Unexpected Error ' + err
        });
    }
}

const usersDelete = async(req, res = response) => {

    const { id } = req.params;
    const authUser = req.user;

    // Deleting the documento from db
    // const user = await User.findByIdAndDelete(id);

    // Logig deleting
    const user = await User.findByIdAndUpdate(id, { status: false });

    res.json({
        ok: true,
        user
    });
}

const usersPatch = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'PATCH - api'
    });
}
 
module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete,
    usersPatch
}

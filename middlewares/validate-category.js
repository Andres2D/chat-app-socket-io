const { response } = require("express");
const { Category } = require('../models');

const validateCategoryByName = async(req, res = response, next) => {

    try {
        let {category} = req.body;
        // Find category
        const categoryDB = await Category.findOne({name: category.toUpperCase()});
        if(!categoryDB) {
            return res.status(400).json({
                ok: false,
                msg: 'The category not exist'
            });
        }
        req.category = categoryDB;
        next();
    }catch(err) {
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        })
    }
}

module.exports = {
    validateCategoryByName
}

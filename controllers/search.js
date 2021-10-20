const { response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { User, Product, Category } = require('../models');

const validCollections = [
    'users',
    'products',
    'categories',
    'roles'
];

const searchUsers = async(term = '', res = response) => {
    
    try {
        const isMongId = ObjectId.isValid(term);
        
        if(isMongId) {
            const user = await User.findById(term);
            return res.json({
                ok: true,
                results: user ? [user] : []
            });
        }

        // Search without case sensitive
        const regexp = new RegExp(term, 'i');
        const users = await User.find({
            $or: [{name: regexp}, {email: regexp}],
            $and: [{status: true}]
        });
        return res.json({
            ok: true,
            results: users
        });


    }catch(err) {
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        });
    }
}

const searchProducts = async(term = '', res = response) => {
    
    try {
        const isMongId = ObjectId.isValid(term);
        
        if(isMongId) {
            const product = await Product.findById(term)
                                            .populate('category', 'name');
            return res.json({
                ok: true,
                results: product ? [product] : []
            });
        }

        // Search without case sensitive
        const regexp = new RegExp(term, 'i');
        const products = await Product.find({name: regexp, status: true})
                        .populate('category', 'name');
        return res.json({
            ok: true,
            results: products
        });

    }catch(err) {
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        });
    }
}


const searchCategories = async(term = '', res = response) => {
    
    try {
        const isMongId = ObjectId.isValid(term);
        
        if(isMongId) {
            const category = await Category.findById(term);
            return res.json({
                ok: true,
                results: category ? [category] : []
            });
        }

        // Search without case sensitive
        const regexp = new RegExp(term, 'i');
        const categories = await Category.find({name: regexp, status: true});
        return res.json({
            ok: true,
            results: categories
        });

    }catch(err) {
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        });
    }
}

const search = async(req, res = response) => {

    const {collection, term} = req.params;

    if(!validCollections.includes(collection)) {
        return res.status(400).json({
            ok: false,
            msg: 'Collection not valid'
        })
    } 

    switch(collection) {
        case 'users':
            searchUsers(term, res);
            break;
        case 'products':
            searchProducts(term, res);
            break;
        case 'categories':
            searchCategories(term, res);
            break;
        default:
            res.status(500).json({
                ok: false,
                msg: 'Unexpected error'
            });
    }
}

module.exports = {
    search
}

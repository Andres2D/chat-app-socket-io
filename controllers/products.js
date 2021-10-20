const { response } = require("express");
const {Product} = require('../models');

const getProducts = async(req, res = response) => {
    try {

        const {limit = 10, from = 0} = req.query;
        const query = {status: true};

        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                    .skip(Number(from))
                    .limit(Number(limit))
                    .populate('user', 'name email')
                    .populate('category', 'name')
        ]);

        res.json({
            ok: true,
            total,
            products
        });
    }catch(err) {
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        });
    }
}

const createProduct = async(req, res = response) => {
    try {
        let {name, price, description} = req.body;
        name = name.toUpperCase();
        const {id} = req.user;
        const category = req.category.id;

        // Check if product exist
        const productDB = await Product.findOne({name});
        if(productDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Product already exist'
            });
        }

        //Generate data to save
        const data = {
            name,
            price,
            description,
            category,
            user: id
        }

        const product = new Product(data);
        await product.save();

        res.json({
            ok: true,
            product
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        })
    }
}

const getProduct = async(req, res = response) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id)
                                        .populate('user', 'name email')
                                        .populate('category', 'name');
        res.json({
            ok: true,
            product
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        })
    }
}

const updateProduct = async(req, res = response) => {
    try {
        const {id} = req.params;
        let {name, price, description} = req.body;
        const user = req.user.id;
        const category = req.category.id;
        
        const product = {
            name: name.toUpperCase(), 
            price,
            description,
            category,
            user
        };

        // {new: true} -> ver la información actualizada
        const productDB = await Product.findByIdAndUpdate(id, product, {new: true});

        res.json({
            ok: true,
            productDB
        });
    }catch(err) {
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        });
    }
}

const deleteProduct = async(req, res = response) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, {status: false});

        res.json({
            ok: true,
            product
        });

    }catch(err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        })
    }
}

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
}

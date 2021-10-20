const { response } = require("express");
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Conf cloudinary
cloudinary.config(process.env.CLOUDINARY_URL);

const {uploadFile} = require('../helpers');
const { User, Product } = require('../models');

const loadFile = async(req, res = response) => {
    try {        
        // Pictures
        // const name = await uploadFile(req.files, ['txt', 'md', 'pdf'], 'test');
        const name = await uploadFile(req.files, undefined, 'imgs');
        res.json({
            ok: true,
            name
        });

    }catch(err) {
        res.status(400).json({
            ok: false,
            msg: err
        });
    }
}

const updateImage = async(req, res = response) => {
    try {
        const {id, collection} = req.params;

        let model;
        switch(collection) {
            case 'users':
                model = await User.findById(id);
                if(!model) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Id not exist'
                    });
                }

                break;
            case 'products':
                model = await Product.findById(id);
                if(!model) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Id not exist'
                    });
                }
                break;
            default:
                res.status(500).json({
                    ok: false,
                    msg: 'Forgot implemet collection'
                })
        }

        // Clean prev files
        if(model.img) {
            const pathImg = path.join(__dirname, `../uploads/${collection}`, model.img);
            if(fs.existsSync(pathImg)) {
                fs.unlinkSync(pathImg);
            }
        }

        const name = await uploadFile(req.files, undefined, collection);
        model.img = name;

        await model.save()

        res.json({
            ok: true,
            model
        });

    }catch(err) {
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        })
    }
}

const updateImageCloudinary = async(req, res = response) => {
    try {
        const {id, collection} = req.params;

        let model;
        switch(collection) {
            case 'users':
                model = await User.findById(id);
                if(!model) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Id not exist'
                    });
                }

                break;
            case 'products':
                model = await Product.findById(id);
                if(!model) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Id not exist'
                    });
                }
                break;
            default:
                res.status(500).json({
                    ok: false,
                    msg: 'Forgot implemet collection'
                })
        }

        // Clean prev files
        if(model.img) {
           const nameArr = model.img.split('/');
           const name = nameArr[nameArr.length - 1];
           const [public_id] = name.split('.'); 
           cloudinary.uploader.destroy(public_id);
        }

        const {tempFilePath} = req.files.file;
        const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

        model.img = secure_url;

        await model.save();

        res.json({
            ok: true,
            model
        });

    }catch(err) {
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        })
    }
}

const showImage = async(req, res = response) => {
    try {
        const {id, collection} = req.params;

        let model;
        switch(collection) {
            case 'users':
                model = await User.findById(id);
                if(!model) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Id not exist'
                    });
                }

                break;
            case 'products':
                model = await Product.findById(id);
                if(!model) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Id not exist'
                    });
                }
                break;
            default:
                res.status(500).json({
                    ok: false,
                    msg: 'Forgot implemet collection'
                })
        }

        // Clean prev files
        if(model.img) {
            const pathImg = path.join(__dirname, `../uploads/${collection}`, model.img);
            if(fs.existsSync(pathImg)) {
                return res.sendFile(pathImg)
            }
        }else{
            const pathImg = path.join(__dirname, '../assets/', 'no-image.jpg');
            if(fs.existsSync(pathImg)) {
                return res.sendFile(pathImg)
            } 
        }

        res.status(500).json({
            ok: false,
            msg: 'Something goes wrong'
        })

    }catch(err) {
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        })
    }
}

module.exports = {
    loadFile,
    updateImage,
    showImage,
    updateImageCloudinary
}


const Role = require('../models/role');
const { User, Category, Product } = require('../models');

const isValidRole = async(role = '') => {
    const existRole = await Role.findOne({role});
    if(!existRole) {
        throw new Error(`The role ${role} isn´t registered on the database`);
    }
}

const validEmail = async(email = '') => {
    const emailExist = await User.findOne({ email });
    if(emailExist) {
        throw new Error(`The email ${email} is currently used by another user`);
    }
}

const validUserId = async(id = '') => {
    const userExist = await User.findById(id);
    if(!userExist) {
        throw new Error(`The id does not exist: [${id}]`);
    }
}

const validCategory = async(id = '') => {
    const query = {status: true};
    const categoryExist = await Category.findById(id)
                                        .where(query);
    if(!categoryExist) {
        throw new Error(`The category not exist`);
    }
}

const validProduct = async(id = '') => {
    const query = {status: true};
    const productExist = await Product.findById(id)
                                        .where(query);
    if(!productExist) {
        throw new Error(`The product not exist`);
    }
}

// Validate allowed collections
const allowedCollections = (collection = '', collections = []) => {
    const include = collections.includes(collection);
    if(!include) {
        throw new Error(`Collection not allowed`);
    }
    return true;
}

module.exports = {
    isValidRole,
    validEmail,
    validUserId,
    validCategory,
    validProduct,
    allowedCollections
}

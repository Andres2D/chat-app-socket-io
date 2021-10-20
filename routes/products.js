const { Router } = require('express');
const { check } = require('express-validator');
const { createProduct, getProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/products');
const { validProduct } = require('../helpers/db-validators');
const { isAdmin } = require('../middlewares');
const { validateCategoryByName } = require('../middlewares/validate-category');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

/**
 * {{url}}/api/products
 */

// Get all the products - public
router.get('/', getProducts);

// Get product by id - public
router.get('/:id', [
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(validProduct),
    validateFields
], getProduct);

// Create product - with a valid token
router.post('/', [
    validateJWT,
    check('name', 'The name is required').notEmpty(),
    validateCategoryByName,
    validateFields
], createProduct);

// Update product by id - with a valid token
router.put('/:id', [
    validateJWT,
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(validProduct),
    check('name', 'The name is required').notEmpty(),
    validateCategoryByName,
    validateFields
], updateProduct);

// Delete product by id - with a valid token only ADMIN
router.delete('/:id', [
    validateJWT,
    isAdmin,
    check('id', 'Invalid id').isMongoId(),
    validateFields
], deleteProduct);

module.exports = router;

const { Router } = require('express');
const { check } = require('express-validator');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categories');
const { validCategory } = require('../helpers/db-validators');
const { isAdmin } = require('../middlewares');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

/**
 * {{url}}/api/categories
 */

// Get all the categories - public
router.get('/', getCategories);

// Get category by id - public
router.get('/:id', [
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(validCategory),
    validateFields
], getCategory);

// Create category - with a valid token
router.post('/', [
    validateJWT,
    check('name', 'The name is required').notEmpty(),
    validateFields
], createCategory);

// Update category by id - with a valid token
router.put('/:id', [
    validateJWT,
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(validCategory),
    check('name', 'The name is required').notEmpty(),
    validateFields
], updateCategory);

// Delete category by id - with a valid token only ADMIN
router.delete('/:id', [
    validateJWT,
    isAdmin,
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(validCategory),
    validateFields
], deleteCategory);

module.exports = router;

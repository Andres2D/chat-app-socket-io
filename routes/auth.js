const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.post('/login', [
    check('email', 'The email is required').isEmail(),
    check('password', 'The password is required').notEmpty(),
    validateFields
], login);

router.post('/google', [
    check('id_token', 'The Token is required').notEmpty(),
    validateFields
], googleSignIn);

module.exports = router;

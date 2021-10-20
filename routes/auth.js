const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { validateFields, validateJWT } = require('../middlewares');

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

router.get('/', validateJWT, renewToken);

module.exports = router;

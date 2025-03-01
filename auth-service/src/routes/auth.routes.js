
const express = require('express');
const { login, retrait } = require('../controllers/auth.controller');

const router = express.Router();


router.post('/login', login);
router.post('/retrait', retrait);

module.exports = router;
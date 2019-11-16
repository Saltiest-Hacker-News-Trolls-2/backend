const router = require('express').Router()
const bcrypt = require('bcryptjs')

const { allPurpose: kxa } = require('../db/dml')

const generateJWT = require('../jwt/generateJWT')

router.post('/register', (req, res) => {})

router.post('/login', (req, res) => {})

module.exports = router

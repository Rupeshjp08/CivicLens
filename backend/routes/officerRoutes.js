const express = require('express');
const router = express.Router();
const { getOfficers } = require('../controllers/officerController');

router.get('/officers', getOfficers);

module.exports = router;

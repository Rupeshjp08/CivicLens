const express = require('express');
const router = express.Router();
const { getAnalytics, getAuditLogs, getCitizens } = require('../controllers/analyticsController');

router.get('/analytics/summary', getAnalytics);
router.get('/audit-logs', getAuditLogs);
router.get('/citizens', getCitizens);

module.exports = router;

const express = require('express');
const { submitIssue } = require('../controllers/issues/issuesController');
const router = express.Router();

router.post('/', submitIssue);

module.exports = router;

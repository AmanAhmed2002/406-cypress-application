const express = require('express');
const { submitIssue, getMyReports, updateIssue, getIssues } = require('../controllers/issues/issuesController');
const router = express.Router();

router.post('/', submitIssue);

router.get('/mine', getMyReports);
router.put('/:id', updateIssue);
router.get('/dashboard', getIssues);

module.exports = router;


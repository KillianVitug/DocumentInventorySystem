const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|/index(.html)?', (req, res) => {
    // res.sendFile('./')
    res.sendFile(path.join(__dirname,'..','views', 'index.html'));
});
router.get('/addRecordPage(.html)?', (req, res) => {
    // res.sendFile('./')
    res.sendFile(path.join(__dirname,'..','views', 'addRecordPage.html'));
});

module.exports = router;
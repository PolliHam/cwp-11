const express = require('express');
const router = express.Router();
const fs = require('fs');

let logFile = './logs.txt';

router.get('*', (req, res) => {
    fs.readFile(logFile, (err, data) => {
        res.end(data.toString());
    })
})

module.exports = router;
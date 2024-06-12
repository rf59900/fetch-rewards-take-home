const express = require('express');
const router = express.Router();
const path = require('path');
const receiptsController = require(path.join('..', 'controllers', 'receiptsController'));

router
    .route('/process')
    .post(receiptsController.processReceipt);

router
    .route('/:id/points')
    .get(receiptsController.getPoints);

module.exports = router;
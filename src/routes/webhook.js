const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Маршрут для обработки вебхуков
router.post('/:topic', webhookController.handleWebhook);

module.exports = router;
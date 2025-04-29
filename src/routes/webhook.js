const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');
const webhookPlankaController = require('../controllers/integrations/webhookPlankaController');

router.post('/:topic', webhookController.handleWebhook);

router.all('/integrations/planka', webhookPlankaController.handleWebhook);

module.exports = router;
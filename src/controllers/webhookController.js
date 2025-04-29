const telegramService = require('../services/telegram');
const Controller = require('./controller');
const webhookValidator = require('../validator/webhook/handleWebhookValidator');

class WebhookController extends Controller {
  constructor() {
    super();
    this.handleWebhook = this.handleWebhook.bind(this);
  }

  async handleWebhook(req, res) {

    try {
      const paramsValidation = webhookValidator.validateParams(req.params);
      if (!paramsValidation.isValid) {
          return this.apiError(
              res, 
              `Invalid parameters: ${paramsValidation.errors.join(', ')}`
          );
      }

      const { topic } = req.params;

      // Проверка существования темы
      const chatId = process.env[`TELEGRAM_PATH_${topic}`];
      if (!chatId) {
        return this.apiError(res, 'Not found topic name');
      }
      
      // Валидация тела запроса
      const payloadValidation = webhookValidator.validateWebhookPayload(req.body);
      if (!payloadValidation.isValid) {
          return this.apiError(
              res, 
              `Invalid payload: ${payloadValidation.errors.join(', ')}`
          );
      }

      const payload = req.body;
      const message = payload.message;
      
      await telegramService.sendMessage(chatId, message);

      return res.json({ 
        success: true, 
        message: 'Webhook processed successfully' 
      });
    } catch (error) {
      console.error('Controller error:', error);
      return this.apiError(res, 'Internal Server Error!', 500);
    }
  }
}

module.exports = new WebhookController();
const telegramService = require('../services/telegram');
const webhookService = require('../services/webhook');
const Controller = require('./controller');
const webhookValidator = require('../validator/webhook/handleWebhookValidator');

class WebhookController extends Controller {
  constructor() {
    super();
    this.handleWebhook = this.handleWebhook.bind(this);
  }

  async handleWebhook(req, res) {

    try {
      // Валидация параметров запроса
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


      // Обработка webhook данных через сервис
      const formattedMessage = await webhookService.processWebhookData(topic, message);
      
      // Отправка сообщения в Telegram
      await telegramService.sendMessage(chatId, formattedMessage);

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
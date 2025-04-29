const TelegramBot = require('node-telegram-bot-api');

class TelegramService {
  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
  }

  async sendMessage(chatId, message) {
    try {
      let message_thread_id = null;
      let partsIds = chatId.split(':');

      if (partsIds.length > 1) {
        message_thread_id = partsIds[1];
      }

      const result = await this.bot.sendMessage(chatId, message, { 
        parse_mode: 'HTML',
        message_thread_id
      });
      return result;
    } catch (error) {
      console.error('Telegram service error:', error);
      throw error;
    }
  }
}

module.exports = new TelegramService();
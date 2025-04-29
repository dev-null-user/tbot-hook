const TelegramBot = require('node-telegram-bot-api');

class TelegramService {
  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
  }

  async sendMessage(chatId, message) {
    try {
      const result = await this.bot.sendMessage(chatId, message, { 
        parse_mode: 'HTML'
      });
      return result;
    } catch (error) {
      console.error('Telegram service error:', error);
      throw error;
    }
  }
}

module.exports = new TelegramService();
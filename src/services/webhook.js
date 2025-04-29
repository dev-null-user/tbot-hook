class WebhookService {
    async processWebhookData(topic, data) {
      try {
        // Здесь можно добавить различную логику обработки данных
        // в зависимости от темы или источника
        const formattedMessage = this.formatMessage(topic, data);
        return formattedMessage;
      } catch (error) {
        console.error('Webhook service error:', error);
        throw error;
      }
    }
  
    formatMessage(topic, data) {
      // Базовое форматирование сообщения
      // Можно добавить различные шаблоны для разных тем
      return `🔔 Новое уведомление по теме: ${topic}\n\n` +
             `📝 Данные:\n${JSON.stringify(data, null, 2)}`;
    }
}
  
module.exports = new WebhookService();
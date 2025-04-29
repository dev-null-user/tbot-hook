const axios = require('axios');

class InnerWebhook {
    constructor() {
        this.host = `http://127.0.0.1:${process.env.PORT}`
    }

    async sendWebhookTelegram(message) {
        try {
            const response = await axios.post(this.host + '/webhook/' + process.env.INNER_TOPIC, {
                message: message
            });
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

module.exports = new InnerWebhook();
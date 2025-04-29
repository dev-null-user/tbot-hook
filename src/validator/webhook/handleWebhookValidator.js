const Validator = require('../validator');

class WebhookValidator extends Validator {

    validateWebhookAuthBearer(headers) {
        const bearer = headers.authorization;
        const errors = [];

        const isValid = bearer == 'Bearer ' + process.env.PLANKA_API_TOKEN;
        
        if (!isValid) {
            errors.push('Access denied! Not valid key!')
        }

        return {isValid, errors}
    }
    
    validateWebhookApiSecury(headers) {
        const apiKey = headers.apikey;
        const errors = [];

        const isValid = apiKey == process.env.INTERNAL_API_KEY;
        
        if (!isValid) {
            errors.push('Access denied! Not valid apikey!')
        }

        return {isValid, errors}
    }

    validateWebhookPayload(payload) {
        const errors = [];

        // Проверка наличия payload
        if (this.isEmpty(payload)) {
            errors.push('Payload is empty');
            return { isValid: false, errors };
        }

        // Проверка обязательных полей
        errors.push(...this.validateRequired(payload, ['message']));

        // Проверка типов данных
        if (payload.message) {
            errors.push(...this.validateType(payload.message, 'message', 'string'));
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    validateParams(params) {
        const errors = [];

        // Проверка обязательных параметров
        errors.push(...this.validateRequired(params, ['topic']));

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = new WebhookValidator();
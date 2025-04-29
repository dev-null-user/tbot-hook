const Validator = require('../validator');

class WebhookValidator extends Validator {
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
class Validator {
    validateRequired(data, requiredFields) {
        const errors = [];
        
        for (const field of requiredFields) {
            if (!(field in data)) {
                errors.push(`Missing required field: ${field}`);
            }
        }

        return errors;
    }

    validateType(value, field, expectedType) {
        if (typeof value !== expectedType) {
            return [`Field "${field}" must be a ${expectedType}`];
        }
        return [];
    }

    isEmpty(value) {
        if (typeof value === 'object') {
            return !value || Object.keys(value).length === 0;
        }
        return !value;
    }
}

module.exports = Validator;

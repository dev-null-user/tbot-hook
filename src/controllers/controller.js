class Controller {
    apiError(res, message, status = 404) {
        return res.status(status).json({
            'success': false,
            'message': message
        });
    }

    apiSuccess(res, message) {
        return res.json({
            'success': true,
            'message': message
        });
    }
}

module.exports = Controller;
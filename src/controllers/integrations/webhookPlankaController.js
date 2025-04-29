const Controller = require('../controller');
const Planka = require('../../services/integrations/planka')
class WebhookPlankaController extends Controller {
    constructor() {
        super();
        this.planka = Planka;
        this.handleWebhook = this.handleWebhook.bind(this);
    }

    async handleWebhook(req, res) {
        try {
            // console.log(req.body.data.included)

            console.log(this.planka.formatData(req.body));

            return this.apiSuccess(res, 'Ok');

        } catch (error) {
            console.error('Empty webhook controller error:', error);
            return this.apiError(res, 'Internal Server Error!', 500);
        }
    }
}

module.exports = new WebhookPlankaController();
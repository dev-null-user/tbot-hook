const Controller = require('../controller');
const Planka = require('../../services/integrations/planka')
const InnerWebhook = require('../../services/integrations/innerWebhook');

const webhookValidator = require('../../validator/webhook/handleWebhookValidator');

class WebhookPlankaController extends Controller {
    constructor() {
        super();
        this.planka = Planka;
        this.innerWebhook = InnerWebhook;
        this.handleWebhook = this.handleWebhook.bind(this);
    }

    async handleWebhook(req, res) {
        try {

            const paramsAccessAuthBearer = webhookValidator.validateWebhookAuthBearer(req.headers);
            if (!paramsAccessAuthBearer.isValid) {
                return this.apiError(
                    res, 
                    `Invalid apikey: ${paramsAccessAuthBearer.errors.join(', ')}`
                );
            }      

            const formatData = await this.planka.formatData(req.body);

            const message = formatData.message;
            let users = '';

            for (let user of formatData.authors) {
                users += (user.username == 'admin' ? '@' + process.env.PLANKA_ADMIN_USERNAME : '@' + user.username) + ' '
            }

            let projectName = formatData.project.name;
            let link = formatData.link;
            
            let messageFull = () => {
                return `Появилось изменение по задачам по проекту: <b>${projectName}</b>\n\nЕе участники: ${users}\n\nЧто изменилось: ${message}\n\nПодробнее по задачи: ${link}`.trim();
            }

            this.innerWebhook.sendWebhookTelegram(messageFull());
            
            return this.apiSuccess(res, 'Ok');

        } catch (error) {
            console.error('Empty webhook controller error:', error);
            return this.apiError(res, 'Internal Server Error!', 500);
        }
    }
}

module.exports = new WebhookPlankaController();
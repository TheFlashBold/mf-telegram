const {Module} = require('mf-lib');
const Telegraf = require('telegraf');
const {Extra, Markup} = Telegraf;

/**
 * @type TelegramModule
 */
class TelegramModule extends Module {
    bots = {};

    async init() {
        const bots = this.config.get("bots", {});
        for (const [name, config] of Object.entries(bots)) {
            this.initBot(name, config);
        }
    }

    initBot(name, config) {
        const bot = new Telegraf(config.token);
        bot.launch(config.options || {});
        this.bots[name] = bot;
        this.log.info("Started bot", name);
    }

    /**
     * Get bot by name
     * @param {string} name
     * @returns {Telegraf}
     */
    getBot(name = "default") {
        return this.bots[name];
    }

    /**
     *
     * @param {number} chatId
     * @param {string} message
     * @param {string|undefined} bot
     * @return {Promise<Message>}
     */
    sendMessage(chatId, message, bot = 'default') {
        return this.getBot(bot).telegram.sendMessage(chatId, message);
    }

    /**
     *
     * @param {number} chatId
     * @param {number} messageId
     * @param {string} message
     * @param {string|undefined} bot
     */
    editMessage(chatId, messageId, message, bot = 'default') {
        this.getBot(bot).telegram.editMessageText(chatId, messageId, undefined, message);
    }

    onAction(trigger, cb, bot) {
        return this.getBot(bot).action(trigger, cb);
    }
}

module.exports = new TelegramModule;
module.exports.Markup = Markup;
module.exports.Extra = Extra;

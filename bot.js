import TelegramApi from 'node-telegram-bot-api';
import { gameOptions, panelOptions } from './options.js';

import { sequelize } from './db.js';

import { User } from './models.js';
// В файле инициализации (перед запуском бота)
(async () => {
    try {
        await sequelize.authenticate();
        await User.sync();
        console.log('✅ Таблица User пересоздана');
    } catch (error) {
        console.error('❌ Ошибка базы данных:', error);
    }
})();
const token = "7589691154:AAEx111GU9Q36mUlSwFrCxlrpee0J9scINw"

const bot = new TelegramApi(token, { polling: true })

const chats = {}


const start = async (chatId) => {
    const rn = Math.floor(Math.random() * 10)

    await bot.sendMessage(chatId, "Bot hid a number from 0 to 9")
    chats[chatId] = rn;
    console.log(chats);
    await bot.sendMessage(chatId, "Try to guess it! \n\n Send me your number", gameOptions);
}


bot.on("message", async (msg) => {

    try {
        bot.setMyCommands([
            { command: "/start", description: "Start the bot" },
            { command: "/info", description: "Get info about user" },
            { command: "/game", description: "Play a game" }
        ])

        const chatId = msg.chat.id;
        const messageText = msg.text;

        if (msg.text === "/start") {
            const [user] = await User.findOrCreate({
                where: { chatId: chatId },
                defaults: {
                    rightAnswers: 0,
                    wrongAnswers: 0
                }
            });
            return bot.sendMessage(chatId, "Welcome to the bot!");
        }

        if (msg.text === "/info") {
            const user = await User.findOne({ where: { chatId: chatId } });
            if (user) {
                return bot.sendMessage(chatId, `You have ${user.rightAnswers} right answers and ${user.wrongAnswers} wrong answers.`);
            } else {
                return bot.sendMessage(chatId, "You have not played any games yet.");
            }
        }

        if (msg.text === '/game') {
            return start(chatId);
        }
    } catch (error) {
        console.error("Error processing message:", error);
        bot.sendMessage(msg.chat.id, "An error occurred while processing your message. Please try again.");
    }

});

bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;

    // Проверяем сначала, не нажата ли кнопка "Играть снова"
    if (query.data === '/game') {
        delete chats[chatId]; // Очищаем предыдущую игру, если нужно
        return start(chatId);
    }

    // Если это не кнопка "Играть снова", обрабатываем ответ
    const userAnswer = parseInt(query.data);
    const correctAnswer = chats[chatId];

    const user = await User.findOne({ where: { chatId: chatId } });

    if (user) {
        if (userAnswer === correctAnswer) {
            await bot.sendMessage(chatId, `You guessed it! The number was ${userAnswer}`, panelOptions);
            user.rightAnswers += 1;
            await user.save();
        } else {
            await bot.sendMessage(chatId, `You didn't guess it! The number was ${correctAnswer}`, panelOptions);
            user.wrongAnswers += 1;
            await user.save();
        }
    }

    delete chats[chatId];
});
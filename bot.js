import TelegramApi from 'node-telegram-bot-api';
import { gameOptions, panelOptions } from './options.js';
const token = "7589691154:AAGXDINWLwofQmneiTnnnxnJ0JeR_2USnXA"

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
    bot.setMyCommands([
        { command: "/start", description: "Start the bot" },
        { command: "/info", description: "Get info about user" },
        { command: "/game", description: "Play a game" }
    ])

    const chatId = msg.chat.id;
    const messageText = msg.text;

    if (msg.text === "/start") {
        return bot.sendMessage(chatId, "Welcome to the bot!");
    }

    if (msg.text === "/info") {
        const userInfo = `
        Your id: ${msg.from.id} \n
        Your Fn ${msg.from.first_name} \n
        Your Ln ${msg.from.last_name} \n`

        return bot.sendMessage(chatId, `You sent: ${messageText} \n\n ${userInfo}`);
    }

    if (msg.text === '/game') {
        return start(chatId);
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

    if (userAnswer === correctAnswer) {
        await bot.sendMessage(chatId, `You guessed it! The number was ${userAnswer}`, panelOptions);
    } else {
        await bot.sendMessage(chatId, `You didn't guess it! The number was ${correctAnswer}`, panelOptions);
    }
    
    delete chats[chatId];
});
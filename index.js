const TelegremApi = require('node-telegram-bot-api');
const {gameOption, againOption} = require('./options.js')
const token = `5505531095:AAHXzVJW3DK5nsZJW_Epoy5_CVEYcTpuyKE`;

const bot = new TelegremApi(token, { polling: true });

const chats = {};


const startGame = async (chatId) => {
   await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать')
   const randomNumber = Math.floor(Math.random() * 10)
   chats[chatId] = randomNumber;
   await bot.sendMessage(chatId, 'Отгадывай', gameOption);
}

const start = () => {
   bot.setMyCommands([
      { command: '/start', description: 'Начальное приветствие' },
      { command: '/info', description: 'Получить инфо' },
      { command: '/game', description: 'Игра угадай цифру' },
   ])

   bot.on('message', async msg => {
      const text = msg.text;
      const chatId = msg.chat.id;
      // bot.sendMessage(chatId, `ты написал мне ${text}`)
      if (text === '/start') {
         await bot.sendSticker(chatId, 'https://tgram.ru/wiki/stickers/img/vstatscats/png/14.png')
         return bot.sendMessage(chatId, 'Добро пожаловать в чат бот MVD')
      }
      if (text === '/info') {
         return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
      }
      if (text === '/game') {
         return startGame(chatId)
      }
      return bot.sendMessage(chatId, 'Я тебя не понимаю')
   })

   bot.on('callback_query', async msg => {
      const data = msg.data;
      const chatId = msg.message.chat.id;
      if (data === '/again') {
         return startGame(chatId)
      }
      if (data === chats[chatId]) {
         return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOption)
      } else {
         return await bot.sendMessage(chatId, `К сожалению, ты не отгадал цифру, бот загадал цифру ${chats[chatId]}`, againOption)
      }
      bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
      console.log(msg);

   })

}
start()
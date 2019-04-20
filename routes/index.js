var express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const getWisdoms = require('../utils/getWisdoms');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;


const token = '791725819:AAHhuu9LnSCU-hCUwT4XWqJVdYFV5GavU0w';
const bot = new TelegramBot(token, { polling: true });

//bot.on('message', (msg) => {
//    bot.sendMessage(msg.chat.id, 'Ill have the tuna. No crust.');
//});

// /jokotai komennolla heittää joko kruunan tai klaavan
const startBot = async () => {
  const wisdoms = await getWisdoms();

  bot.onText(/\/jokotai/, (msg, match) => {
    const chatId = msg.chat.id;
    let tulos = Math.random();
    bot.sendMessage(chatId, '<i>&#9835 Se on kuulkaas joko tai, Joko tai &#9835</i>', { parse_mode: 'HTML' });

    if (tulos > 0.5) {
      bot.sendMessage(chatId, '<b>Klaava:</b> KLAAVALLA ESSON BAARIIN!', { parse_mode: 'HTML' }); //Muuta italics ja lisää jotain kivaa
    }
    if (tulos < 0.5) {
      bot.sendMessage(chatId, '<b>Kruuna:</b> Kruunalla kotiin :(', { parse_mode: 'HTML' });
    }
  });

  bot.onText(/\/quote/, msg => {
    const chatId = msg.chat.id;

    const randomWisdom = wisdoms[Math.floor(Math.random() * wisdoms.length)];

    bot.sendMessage(chatId, randomWisdom);
  });

  bot.on('message', msg => {
    const chatId = msg.chat.id;

    const message = msg.text;

    //Jos lauseen keskellä on "vai" niin syöttää jomman kumman vaihtoehdon takaisin
    var taulukko = message.split(' ');
    if (taulukko.length == 3) {
      if (taulukko[1] === 'vai') {
        var sana1 = taulukko[0];
        var sana2 = taulukko[2];

        let tulos = Math.random();

        if (tulos > 0.5) {
          bot.sendMessage(chatId, sana1);
        }
        if (tulos < 0.5) {
          bot.sendMessage(chatId, sana2);
        }
      }
    }
  });
};

startBot();

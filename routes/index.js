var express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const getWisdoms = require('../utils/getWisdoms');
const { loadCatImage, loadDogImage } = require('../utils/loadAnimalImage');
const getEvents = require('../utils/getEvents');
const semmaApi = require('../utils/semma');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

const token = '791725819:AAHhuu9LnSCU-hCUwT4XWqJVdYFV5GavU0w';
const bot = new TelegramBot(token, { polling: true });

// /jokotai komennolla heittää joko kruunan tai klaavan
const startBot = async () => {
  const wisdoms = await getWisdoms();

  bot.onText(/\/piato/, async (msg, match) => {      const chatId = msg.chat.id;
      var num = 0;
      let lause = msg.text.split(" ");
      if(lause[1] !== undefined) {
          if (lause[1].trim() === "h") num = 1; // HUOMENNA
          else if (lause[1].trim() === "yh") num = 2; // YLIHUOMENNA
      };
      var obj = await semmaApi();
      var restaurant_name = obj.RestaurantName;
      var week = obj.MenusForDays;

      var day = week[0];
      var open_time = day.LunchTime;
      var food = day.SetMenus;

      var dayTxt = "_Tänään_";
      if (num == 1) dayTxt = "_Huomenna_";
      else if (num == 2) dayTxt = "_Ylihuomenna_";
      var responseTxt = '*' + restaurant_name + '* ' + dayTxt + '\r\n';
      if (open_time !== null) {
          responseTxt += 'Lounas: ' + open_time + '\r\n';
          for (i = 0; i < food.length; i++) {
              responseTxt += '*' + food[i].Name + '* ';
              responseTxt += '_' + food[i].Price + '_\r\n';
              for (y = 0; y < food[i].Components.length; y++) {
                  responseTxt += food[i].Components[y].replace('*', '\\*') + '\r\n';
              }
          }
      } else {
          responseTxt += "Kiinni :(";
      }

      bot.sendMessage(chatId, responseTxt, {parse_mode: 'Markdown'});

  });

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

  bot.onText(/\/kissa/, async msg => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Oottele ku kuva lattaileepi');
    try {
      const image = await loadCatImage();
      bot.sendPhoto(chatId, image.url);
    } catch (error) {
      bot.sendMessage(chatId, 'Joku meni ny rikki, kokeile vaikka uuestaa');
    }
  });
  
  bot.onText(/\/koira/, async msg => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Oottele ku kuva lattaileepi');
    try {
      const image = await loadDogImage();
      bot.sendPhoto(chatId, image.url);
    } catch (error) {
      bot.sendMessage(chatId, 'Joku meni ny rikki, kokeile vaikka uuestaa');
    }
  });

  bot.onText(/\/viisaus/, msg => {
    const chatId = msg.chat.id;

    const randomWisdom = wisdoms[Math.floor(Math.random() * wisdoms.length)];

    bot.sendMessage(chatId, randomWisdom);
  });

  bot.onText(/\/tapahtumat/, async msg => {
      const chatId = msg.chat.id;

      const events = await getEvents();
      bot.sendMessage(chatId, events, { parse_mode: 'HTML' });
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

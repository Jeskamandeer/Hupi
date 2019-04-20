var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

const TelegramBot = require('node-telegram-bot-api');

const token = '791725819:AAHhuu9LnSCU-hCUwT4XWqJVdYFV5GavU0w';
const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
    bot.sendMessage(msg.chat.id, 'Ill have the tuna. No crust.');
});
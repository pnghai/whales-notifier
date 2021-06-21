"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var TelegramBot = require("node-telegram-bot-api");
var token = process.env['TELEGRAM_TOKEN'];
var chatId = process.env['TELEGRAM_CHAT_ID'];
var tracking_address = process.env['TRACKING_ADDRESS'];
var bot = new TelegramBot(token, { polling: true });
var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();
client.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
});
client.on('connect', function (connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function () {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
        bot.sendMessage(chatId, message.toString());
    });
    function subscribeService() {
        if (connection.connected) {
            var content = {
                "op": "addr_sub",
                "addr": tracking_address,
            };
            connection.sendUTF(content.toString());
        }
    }
    subscribeService();
});
client.connect('wss://ws.blockchain.info/inv');

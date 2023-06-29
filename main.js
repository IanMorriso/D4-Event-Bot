const Discord = require('discord.js');
const puppeteer = require('puppeteer');
const Database = require('@replit/database');
const config = require('./config.json')

const db = new Database();

// Creates a new Discord bot
const client = new Discord.Client({ intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent
] });



// Confirms launch of bot
client.once('ready', () => {
    console.log('client ready');
})


// Checks for message in discord channel
client.on('messageCreate', message => {

    if (message.author.bot) return

    if (message.content === "$helltide" ||
        message.content === "$boss" ||
        message.content === "$legion") {
            scrapeData(message);
    }
})

// Scrapes data from webpage and replies to discord user with remaining time until event triggers
async function scrapeData(request) {
    const browser = await puppeteer.launch(); // Launches headless browser
    const page = await browser.newPage();
    await page.goto("https://d4armory.io/events/"); // Webpage where we scrape data
    let selector

    // Checks for one of three events in Diablo 4 and sets selector accordingly
    switch(request.content) {
        case "$helltide":
            selector = "#tableHelltideNext"
            break;

        case "$boss":
            selector = "#tableBossNext"
            break;

        case "$legion":
            selector = "#tableLegionNext"
            break;

        default:
            break;
    }

    // Waits for selector to load and replies with remaining time until event trigger
    const data = await page.waitForSelector(selector);
    request.reply(String(await data?.evaluate(el => el.textContent)))
}


client.login(config.token);
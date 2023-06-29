const Discord = require('discord.js');
const puppeteer = require('puppeteer');
const Database = require('@replit/database');
const config = require('./config.json')

const db = new Database();

// Creates a new Discord bot
const client = new Discord.Client({ intents: [
    //32767
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

    const data = await page.waitForSelector(selector);
    request.reply(String(await data?.evaluate(el => el.textContent)))



    /*if (request.content === '$helltide') {
        const helltideSelector = await page.waitForSelector("#tableHelltideNext");
        const helltideTime = request.reply(String(await helltideSelector?.evaluate(el => el.textContent)))

    }
    const bossSelector = await page.waitForSelector("#tableBossNext");
    const helltideSelector = await page.waitForSelector("#tableHelltideNext");
    const legionSelector = await page.waitForSelector("#tableLegionNext");
    
    const bossTime = await bossSelector?.evaluate(el => el.textContent)
    const helltideTime = await helltideSelector?.evaluate(el => el.textContent)
    const legionTime = await legionSelector?.evaluate(el => el.textContent)*/

    //console.log(bossTime, helltideTime, legionTime);
    //console.log(string(helltideTime).type)

    //return helltideTime
}





client.login(config.token);
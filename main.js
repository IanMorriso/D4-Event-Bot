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


async function scrapeData(request) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://d4armory.io/events/");

    if (request.content === '$helltide') {
        const helltideSelector = await page.waitForSelector("#tableHelltideNext");
        const helltideTime = request.reply(String(await helltideSelector?.evaluate(el => el.textContent)))

    }
    const bossSelector = await page.waitForSelector("#tableBossNext");
    const helltideSelector = await page.waitForSelector("#tableHelltideNext");
    const legionSelector = await page.waitForSelector("#tableLegionNext");
    
    const bossTime = await bossSelector?.evaluate(el => el.textContent)
    const helltideTime = await helltideSelector?.evaluate(el => el.textContent)
    const legionTime = await legionSelector?.evaluate(el => el.textContent)

    //console.log(bossTime, helltideTime, legionTime);
    //console.log(string(helltideTime).type)

    //return helltideTime
}





client.login(config.token);
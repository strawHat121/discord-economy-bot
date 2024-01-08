require("dotenv/config")
const { Client, IntentsBitField } = require("discord.js")
const { CommandHandler } = require('djs-commander')
const path = require('path')
const mongoose = require('mongoose')

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});


// Used for separating events into separate different files 
new CommandHandler({
    client,
    eventsPath: path.join(__dirname, 'events'),
    commandsPath: path.join(__dirname, 'commands')
})


const main = async () => {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to DB")
    client.login(process.env.TOKEN);
}

main()
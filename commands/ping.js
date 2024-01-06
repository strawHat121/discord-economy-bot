module.exports = {
    //the name and the description of the bot command
    data: {
        name: 'ping',
        description: 'Replies with a pong'
    },
    // function that needs to be executed whenever someone in the server puts this command
    run: ({ interaction }) => {
        interaction.reply('Pong!')
    },

    // Do this if you want this command to not work anymore.
    // deleted: true
}
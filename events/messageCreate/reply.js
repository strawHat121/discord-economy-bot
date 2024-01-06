module.exports = (message) => {

    if (message.author.bot) return;

    if (message.content === "Hello") {
        message.reply('Hiiiii')
    }
}
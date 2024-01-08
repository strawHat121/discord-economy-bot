const { ApplicationCommandOptionType } = require("discord.js");
const UserProfile = require("../../schemas/UserProfile");

module.exports = {
    data: {
        name: 'gamble',
        description: 'Gamble your money away',
        options: [
            {
                name: 'amount',
                description: 'The amount you would like to gamble away',
                type: ApplicationCommandOptionType.Number,
            }
        ]
    },
    run: async ({ interaction }) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: "This command can only be executed inside a server",
                ephemeral: true,
            });
            return;
        }

        const amount = interaction.options.getNumber('amount');

        if (amount < 10) {
            interaction.reply('You must gamble atleast 10 dollars.')
            return;
        }

        let userProfile = await UserProfile.findOne({
            userId: interaction.user.id,
        })

        if (!userProfile) {
            userProfile = new UserProfile({
                userId: interaction.user.id
            });
        }

        if (amount > userProfile.balance) {
            interaction.reply("You dont have enough balance to gamble");
            return;
        }

        const didWin = Math.random() > 0.5;

        if (!didWin) {
            userProfile.balance -= amount;
            await userProfile.save();

            interaction.reply("You didn't win anything. Try again later");
            return;
        }

        const amountWon = Number((amount * (Math.random() + 0.55)).toFixed(0));

        userProfile.balance += amountWon;
        await userProfile.save();

        interaction.reply(`You won $${amountWon}.\nNew Balance: $${userProfile.balance}`)
    }
}
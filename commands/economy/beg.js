const Cooldown = require("../../schemas/Cooldown");
const UserProfile = require("../../schemas/UserProfile");

const getRandomNumber = (x, y) => {
    const range = y - x + 1;
    const randomNumber = Math.floor(Math.random() * range);
    return randomNumber + x;
}

module.exports = {
    //the name and the description of the bot command
    data: {
        name: 'beg',
        description: 'Get extra balance'
    },
    // function that needs to be executed whenever someone in the server puts this command
    run: async ({ interaction }) => {
        if (!interaction.inGuild()) {
            await interaction.reply({
                content: "You can only run this command inside a server.",
                ephemeral: true
            });
            return;
        }
        try {
            await interaction.deferReply();

            const commandName = 'beg';
            const userId = interaction.member.id;

            let cooldown = await Cooldown.findOne({ userId, commandName });

            if (cooldown && Date.now() < cooldown.endsAt) {
                const { default: prettyMs } = await import('pretty-ms');

                await interaction.editReply(
                    `You are on cooldown, come back after ${prettyMs(cooldown.endsAt - Date.now())}`
                );
                return;
            }

            if (!cooldown) {
                cooldown = new Cooldown({ userId, commandName });
            }

            const chance = getRandomNumber(0, 100);

            if (chance < 20) {
                await interaction.editReply("You didn't get anything. Try again later")
                cooldown.endsAt = Date.now() + 300_000;
                await cooldown.save();
                return;
            }

            const amount = getRandomNumber(30, 150);

            let userProfile = await UserProfile.findOne({ userId }).select('userId balance');

            if (!userProfile) {
                userProfile = new UserProfile({ userId });
            }

            userProfile.balance += amount;
            cooldown.endsAt = Date.now() + 300_000;

            await userProfile.save();
            await cooldown.save();

            await interaction.editReply(`You got $${amount}!\nNew balance: $${userProfile.balance}`);

        } catch (error) {
            console.log(`${error}`)
        }
    },
}
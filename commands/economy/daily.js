const UserProfile = require("../../schemas/UserProfile")

const dailyAmount = 500;

module.exports = {
    //the name and the description of the bot command
    data: {
        name: 'daily',
        description: 'Collect your daily'
    },
    // function that needs to be executed whenever someone in the server puts this command
    run: async ({ interaction }) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: "This command can only be executed inside a server.",
                ephemeral: true,
            });
            return;
        }

        try {
            await interaction.deferReply();

            let userProfile = await UserProfile.findOne({
                userId: interaction.member.id,
            })

            if (userProfile) {
                const lastDailyDate = userProfile.lastDailyCollected?.toDateString();
                const currentDate = new Date().toDateString();

                if (lastDailyDate === currentDate) {
                    interaction.editReply("You have already collected your daily")
                    return;
                }
            } else {
                userProfile = new UserProfile({
                    userId: interaction.member.id,
                });
            }

            userProfile.balance += dailyAmount;
            userProfile.lastDailyCollected = new Date();

            await userProfile.save();

            interaction.editReply(
                `${dailyAmount} was added to your balance.\n New Balance: $${userProfile.balance}`
            )
        } catch (error) {
            console.log(`Error handling: ${error}`)
        }
    },

    // Do this if you want this command to not work anymore.
    // deleted: true
}
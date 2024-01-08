const { Schema, model } = require('mongoose');

const cooldownSchema = new Schema({
    commandName: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    endsAt: {
        type: String,
        required: true,
    }
});

module.exports = model('Cooldown', cooldownSchema);
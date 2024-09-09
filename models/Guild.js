const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    language: {
        type: String,
        default: 'en'  // Langue par défaut
    }
});

module.exports = mongoose.model('Guild', guildSchema);

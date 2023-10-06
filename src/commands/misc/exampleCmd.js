const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Validate a command')
        .setDMPermission(false)
        .toJSON(),
        userPermissions: [PermissionFlagsBits.ManageMessagesS],
        botPermissions: [PermissionFlagsBits.Connect],

        run: (client, interaction) => {
            return interaction.reply
            ("This is a test command");
        }
};
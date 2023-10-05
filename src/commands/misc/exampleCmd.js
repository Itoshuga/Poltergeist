const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Validate a command')
        .setDMPermission(false)
        .addSubcommandGroup((subcommandgroup) =>
            subcommandgroup
            .setName('user')
            .setDescription('configure a user')
            .addSubcommand((subcommand) =>
                subcommand
                .setName('role')
                .setDescription('configure a role')
                .addUserOption(option =>
                    option.setName('user')
                    .setDescription('the user to configure')
                )
            )
            .addSubcommand((subcommand) =>
                subcommand
                .setName('nickname')
                .setDescription('configure a users nickname')
                .addStringOption(option =>
                    option.setName('nickname')
                    .setDescription('the nickname the user should have')
                )
                .addUserOption(option =>
                    option.setName('user')
                    .setDescription('the user to configure')
                )
            )
        )
        .addSubcommand((subcommand) =>
            subcommand
            .setName('message')
            .setDescription('configure a message')
        )
        .toJSON(),
        userPermissions: [PermissionFlagsBits.ManageMessagesS],
        botPermissions: [PermissionFlagsBits.Connect],

        run: (client, interaction) => {
            return interaction.reply("This is a test command");
        },
    deleted: false
};
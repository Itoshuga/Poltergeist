const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const i18n = require('i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of available commands.'),
    async execute(interaction) {
        const guildId = interaction.guild.id;

        // Récupérer la langue de la guild à partir de la base de données si vous utilisez i18n
        const Guild = require('../models/Guild');
        const guild = await Guild.findOne({ guildId });
        const language = guild ? guild.language : 'en';
        i18n.setLocale(language);

        // Récupérer toutes les commandes dans le dossier 'commands'
        const commandsPath = path.join(__dirname, '../commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        // Créer un embed pour afficher les commandes
        const helpEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(i18n.__('Help Menu'))
            .setDescription(i18n.__('Here are the available commands:'));

        // Ajouter chaque commande avec sa description dans l'embed
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            helpEmbed.addFields({ name: `/${command.data.name}`, value: command.data.description, inline: false });
        }

        // Envoyer l'embed en réponse
        await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    },
};

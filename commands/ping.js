const { SlashCommandBuilder } = require('@discordjs/builders');
const i18n = require('i18n');
const Guild = require('../models/Guild');  // Importer le modèle Guild

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        const guildId = interaction.guild.id;

        // Récupérer la langue de la guild à partir de la base de données
        const guild = await Guild.findOne({ guildId });
        const language = guild ? guild.language : 'en';  // Si la langue n'est pas définie, utiliser 'en' par défaut

        // Définir la locale d'i18n pour cette interaction
        i18n.setLocale(language);

        // Obtenir le ping (latence) entre l'envoi et la réception d'un message
        const sent = await interaction.reply({ content: i18n.__('pong'), fetchReply: true });
        const ping = sent.createdTimestamp - interaction.createdTimestamp;
        const apiPing = Math.round(interaction.client.ws.ping);

        // Modifier la réponse avec le ping réel et le ping de l'API
        await interaction.editReply(i18n.__('ping', { 
            0: ping, 1: apiPing
        }));
    },
};

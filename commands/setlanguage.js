const { SlashCommandBuilder } = require('@discordjs/builders');
const Guild = require('../models/Guild');  // Importer le modèle Guild

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlanguage')
        .setDescription('Permet de définir la langue du bot pour ce serveur')
        .addStringOption(option =>
            option.setName('language')
                .setDescription('Choisissez la langue: "en" ou "fr"')
                .setRequired(true)
                .addChoices(
                    { name: 'English', value: 'en' },
                    { name: 'Français', value: 'fr' }
                )),
        
    async execute(interaction) {
        const language = interaction.options.getString('language');
        const guildId = interaction.guild.id;

        // Chercher la guild dans la base de données
        let guild = await Guild.findOne({ guildId });

        if (!guild) {
            // Si la guild n'existe pas encore dans la base de données, on la crée
            guild = new Guild({ guildId, language });
            await guild.save();
        } else {
            // Si elle existe, on met à jour la langue
            guild.language = language;
            await guild.save();
        }

        // Envoyer une confirmation à l'utilisateur
        await interaction.reply(`La langue a été définie sur ${language === 'en' ? 'English' : 'Français'}.`);
    }
};

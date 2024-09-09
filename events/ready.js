const { REST, Routes } = require('discord.js');
const mongoose = require("mongoose");
const Guild = require('../models/Guild'); // Importer le modèle Guild
const mongoURI = process.env.MONGODB_URI;

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Logged in as ${client.user.tag}`);

        // Enregistrer les Slash Commands après que le bot est prêt
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        const commands = [];
        const commandFiles = require('fs').readdirSync('./commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            commands.push(command.data.toJSON());
        }

        try {
            console.log('Started refreshing application (/) commands.');

            // Enregistrer les commandes globalement
            await rest.put(
                Routes.applicationCommands(client.user.id), // Utiliser l'ID du bot qui est maintenant défini
                { body: commands },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }

        // Connexion à MongoDB
        if (await mongoose.connect(mongoURI)) {
            console.log(`Connected to the MongoDB database.`);

            // Parcourir toutes les guilds auxquelles le bot est connecté
            client.guilds.cache.forEach(async (guild) => {
                const guildId = guild.id;

                // Vérifier si la guild est déjà dans la base de données
                let guildDB = await Guild.findOne({ guildId });

                if (!guildDB) {
                    // Si la guild n'existe pas dans la base de données, l'ajouter avec l'anglais par défaut
                    guildDB = new Guild({
                        guildId: guildId,
                        language: 'en'  // Langue par défaut : anglais
                    });
                    await guildDB.save();
                    console.log(`Added guild ${guild.name} with default language 'en' to the database.`);
                } else {
                    console.log(`Guild ${guild.name} is already in the database.`);
                }
            });

            console.log('Finished checking guilds and database.');
        } else {
            console.error('Failed to connect to MongoDB.');
        }
    },
};
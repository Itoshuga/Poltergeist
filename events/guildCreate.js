const Guild = require('../models/Guild'); // Importer le modèle Guild

module.exports = {
    name: 'guildCreate',
    async execute(guild) {
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
            console.log(`Added new guild ${guild.name} with default language 'en' to the database.`);
        } else {
            console.log(`Guild ${guild.name} already exists in the database.`);
        }
    },
};

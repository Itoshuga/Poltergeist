const { Client, Collection, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const i18n = require('i18n');
const Guild = require('./models/Guild'); // Importer le modèle Guild

// Charger les variables d'environnement
dotenv.config();

// Initialiser le bot Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();

// Charger les commandes
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Charger les événements
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

i18n.configure({
    locales: ['en', 'fr'],  // Ajoutez toutes les langues supportées
    directory: __dirname + '/locales',  // Chemin vers le dossier des fichiers de traduction
    logWarnFn: function (msg) {
        console.warn('i18n Warning: ' + msg);
    },
    logErrorFn: function (msg) {
        console.error('i18n Error: ' + msg);
    },
    objectNotation: true  // Support pour les objets imbriqués
});


// if (await mongoose.connect(process.env.MONGODB_URI)) {
//     console.log('Connected to MongoDB');
// }

// Connexion à MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => {
//     console.log('Connected to MongoDB');
// }).catch(err => {
//     console.error('Failed to connect to MongoDB', err);
// });

// Démarrer le bot
client.login(process.env.TOKEN);

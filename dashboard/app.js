const express = require('express');
const mongoose = require('mongoose');
const i18n = require('i18n');

const app = express();
const port = 3000;

// Configurer i18n pour le site web
i18n.configure({
    locales: ['en', 'fr'],
    directory: __dirname + '/locales',
    defaultLocale: 'en',
    queryParameter: 'lang',
    objectNotation: true
});

app.use(i18n.init);

// Page de tableau de bord
app.get('/', (req, res) => {
    res.send(i18n.__('greeting'));
});

// Connexion à MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => {
//     console.log('Connected to MongoDB');
// }).catch(err => {
//     console.error('Failed to connect to MongoDB', err);
// });

app.listen(port, () => {
    console.log(`Dashboard running on http://localhost:${port}`);
});

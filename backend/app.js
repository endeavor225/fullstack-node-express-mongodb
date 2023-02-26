const express = require('express');
const mongoose = require('mongoose');

const path = require('path');

// Pour gerer le "Warning" strictQuery
mongoose.set("strictQuery", false);

// Models
const Thing = require('./models/thing');

// Pour ce connecter à une base de données mongoDB
mongoose.connect('mongodb://root:admin@localhost/backendDB?authSource=admin&useUnifiedTopology=true',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Créer un serveur express
const app = express();

// Pour avoir accès au corps de la requete || On peut aussi utiliser bodyParser
app.use(express.json());

// Pour resoudre le problème de CORS Origin
// on peut aussi utiliser package cors
/*
const cors = require('cors')
var corsOptions = {
  origin: '*',
}
app.use(cors(corsOptions));
*/
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
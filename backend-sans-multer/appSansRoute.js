const express = require('express');
const mongoose = require('mongoose');

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


app.post('/api/stuff', (req, res, next) => {
    // Dans mon cas le frontend envoi un _id que je supprime
    delete req.body._id;
    const thing = new Thing({
        // title : res.body.title

        //Où avec l'opérateur spread
        ...req.body
    });
    thing.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
});

app.get('/api/stuff', (req, res, next) => {
    Thing.find()
      .then(things => res.status(200).json(things))
      .catch(error => res.status(400).json({ error }));
});

app.get('/api/stuff/:id', (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));
});

app.put('/api/stuff/:id', (req, res, next) => {
    Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
});

app.delete('/api/stuff/:id', (req, res, next) => {
    Thing.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
});

module.exports = app;
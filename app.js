const express = require('express')
const bodyParser = require('body-parser')

const app = express()

// Parse the request content application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    mongoose.connect(dbConfig.local_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Successfully connected to the database");    
    }).catch(err => {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit();
    });
});


// export routes
require('./app/routes/game.routes.js')(app);

app.get('/', (req, res) => {
    res.json({"message": "Welcome to Game App."});
});

// listen to request
const port = process.env.PORT || 8080
app.listen(port, () =>
    console.log(`Server is listening on port ${port}`)
)

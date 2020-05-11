module.exports = (app) => {
    const api = require('../api/game.handler.js');

// create game, returns game_id
app.post('/api/game/create', api.createGame);

// get ticket for selected game and user, returns ticket_id
app.get('/api/game/:game_id/ticket/:user_name/generate', api.generateTicket);

// retrieve ticket
app.get('/ticket/:ticket_id', api.retrieveTicket);

// pick random number for game without duplicates
app.get('/api/game/:game_id/number/random', api.pickNumber);

// retrieve game numbers, returns all numbers picked for this game until now
app.get('/api/game/:game_id/numbers', api.getNumbers);

// retrieve game details, 
// return stats of the game {numbers drawn/no of tickets/no of users}
app.get('/api/game/:game_id/stats', api.getStats);

}


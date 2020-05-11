const mongoose = require('mongoose');



const GameSchema = mongoose.Schema({
    game_id: String,
    game_name: String,
    numbers: []
}, {
    timestamps: true
});

const TicketSchema = mongoose.Schema({
    ticket_id: String,
    user_name: String,
    game_id: String
},{
    timestamps: true
})

const GameNumberSchema = mongoose.Schema({
    game_id: String,
    ticket_id: String,
    
})


Game = mongoose.model('Game', GameSchema);
Ticket = mongoose.model('Ticket', TicketSchema);
GameNumber = mongoose.model('GameNumber', GameNumberSchema)

module.exports = {Game, Ticket, GameNumber};

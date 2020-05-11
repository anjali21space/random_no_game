const schema = require('../models/game.model.js')
var uuid = require('uuid');

// create new game, payload: game_name, return: game_id
exports.createGame = (req, res) =>{
    // Validate request
    if(!req.body.game_name) {
        return res.status(400).send({
            message: "Please provide game_name."
        });
    }
    // Create a game
    const game = new schema.Game({
        game_name: req.body.game_name || "Untitled Game",
        game_id: uuid.v4()
    });
    // Save Game in the database
    game.save()
    .then(data => {
        res.status(200).send({'game_id': data.game_id});
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Game."
        });
    });
};

// create ticket for user, URL Param: game_id, user_name, return: ticket_id
exports.generateTicket = (req, res) =>{
    // validate request params
    game_id = req.params.game_id
    user_name = req.params.user_name
    if (!game_id){
        return res.status(400).send({
            message: "Please provide game_id."
        })
    }
    if(!user_name){
        return res.status(400).send({
            message: "Please provide user_name."
        })
    }

    schema.Ticket.find({'game_id': game_id, 'user_name': user_name}).then(ticket =>{
        if(ticket.length===1){
            return res.status(200).send({
                message: "Ticket already created for given user and game.",
                ticket_id: ticket[0]['ticket_id']
            })
        }
        else{
            schema.Game.find({'game_id': game_id}).then(game =>{
                if(game.length===0){
                    return res.status(404).send({
                        message: "Game with given game_id does not exists."
                    })
                }
            })
            // Create a ticket
            const ticket = new schema.Ticket({
                ticket_id: uuid.v4(),
                game_id: game_id,
                user_name: user_name
            });
            // Save Ticket in the database
            ticket.save()
            .then(data => {
                res.status(200).send({'ticket_id': data.ticket_id});
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while generating Ticket."
                });
            });
        }
    })

};

// fetch ticket details, URL Param: ticket_id, return: ticket details of given ticket
exports.retrieveTicket = (req, res) =>{
    ticket_id = req.params.ticket_id
    if (!ticket_id){
        return res.status(400).send({
            message: "Please provide ticket_id."
        })
    }
    else{
        schema.Ticket.find({'ticket_id': ticket_id}).then(ticket =>{
            if(ticket.length===0){
                return res.status(404).send({
                    message: "Ticket with given ticket_id does not exists."
                })
            }
            else{
                return res.status(200, {'Content-Type': 'text/html'}).send(
                    '<table><tr><th>Ticket ID</th><th>User Name</th>' +
                    '<th>Created On</th></tr><tr>' +
                    '<td>'+ ticket[0].ticket_id + '</td>' +
                    '<td>'+ ticket[0].user_name + '</td>' +
                    '<td>'+ ticket[0].createdAt + '</td>' +
                    '</tr></tr></table>'
                )
            }
        })
    }
    
};

// randomly select a number, URL Param: game_id, return: random number
exports.pickNumber = (req, res) =>{
    game_id = req.params.game_id
    if(!game_id){
        return res.status(400).send({
            message: "Please provide game_id."
        })
    }
    schema.Game.find({'game_id': game_id}).then(game =>{
        if(game.length===0){
            return res.status(404).send({
                message: "Game with given game_id does not exists."
            })
        }
        else{
            random = Math.floor((Math.random() *(new Date().getTime()) ))
            schema.Game.updateOne({'game_id':game_id}, 
            {$addToSet:{numbers:{number:random}}}).then(num =>{
                    return res.status(200).send({
                        number: random,
                        data: game
                    })
                })      
        }
    }) 
    };

// fetches list of numbers, URL Param: game_id, return: list of numbers
exports.getNumbers = (req, res) =>{
    game_id = req.params.game_id
    if(!game_id){
        return res.status(400).send({
            message: "Please provide game_id."
        })
    }
    schema.Game.find({'game_id': game_id}).then(game =>{
        if(game.length===0){
            return res.status(404).send({
                message: "Game with given game_id does not exists."
            })
        }
        else{
            if(game[0].numbers.length === 0){
                return res.status(400).send({
                    message: "No numbers are chosen for the selected Game."
                })
            }
            let numbers = []
            for(let val of game[0].numbers){
                numbers.push(val.number)
            }
            return res.status(200).send({
                numbers: numbers
            })
        }
    });
};

// fetches game details, ULR Param: game_id, return: game stats
exports.getStats = (req, res) =>{
    game_id = req.params.game_id
    if(!game_id){
        return res.status(400).send({
            message: "Please provide game_id."
        })
    }
    schema.Game.find({'game_id': game_id}).then(game=>{
        if(game.length===0){
            return res.status(404).send({
                message: "Game not found for given game_id."
            })
        }
        else{
            schema.Ticket.find({'game_id': game_id}).then(ticket=>{
                let numbers_drawn = 0
                let tickets = 0
                if(game[0].numbers){
                    numbers_drawn = game[0].numbers.length
                }
                if(ticket.length){
                    tickets = ticket.length;
                }
                return res.status(200).send({
                    "Numbers Drawn": numbers_drawn,
                    "Number of Tickets": tickets,
                    "Number of Users": tickets
                })
            }) 
        }
    })
};

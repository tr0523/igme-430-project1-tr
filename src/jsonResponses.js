const pokedexSource = require('./pokedex.json');

const pokedexString = JSON.stringify(pokedexSource);
const pokedex = JSON.parse(pokedexString);

const respondJSON = (request, response, status, object, justHead = false) => {
    const content = JSON.stringify(object);

    const headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    };

    response.writeHead(status, headers);

    if(!justHead){
        response.write(content);
    }
    response.end();
};

const getByName = (request, response, name) => {
    correctID = -1;
    pokedex.forEach(pokemon => {
        if(pokemon.name == name){
            const responseJSON = {
                pokemon
            };   
            return respondJSON(request, response, 200, responseJSON);
        }
    });

    const responseJSON = {
        message: 'Pokemon not found by that name in API',
    };

    return respondJSON(request, response, 204, responseJSON);
    
};

const getByType = (request, response, searchType) => {
    correctPokemon = {};
    correctNum = 0

    pokedex.forEach(pokemon => {
        pokemon.type.forEach(type => {
            if(type == searchType){
                correctPokemon[correctNum] = pokemon;
                correctNum++;
            }
        })
    });

    if(correctNum == 0){
        const responseJSON = {
            message: 'Pokemon not found by that type in API',
        };
        return respondJSON(request, response, 204, responseJSON);
    }
    else{
        const responseJSON = {
            correctPokemon,
        };
        return respondJSON(request, response, 200, responseJSON);
    }
    
};

const getByNumber = (request, response, number) => {
    if(pokedex[number-1]){
        pokemon = pokedex[number-1];
        const responseJSON = {
            pokemon
        };   
        return respondJSON(request, response, 200, responseJSON);
    }

    const responseJSON = {
        message: 'Pokemon not found by that number in API',
    };

    return respondJSON(request, response, 204, responseJSON);
    
};

const getByStage = (request, response, stage, onlyThreeStagers = false) => {
    correctPokemon = {};
    correctNum = 0

    pokedex.forEach(pokemon => {
        
        preEvos = 0;
        pokedex.forEach(maybePreEvos => {
            maybePreEvos.next_evolution.forEach(evoCheck => {
            if(evoCheck.num = pokemon.num){
                preEvos++;
            }
        })
        }

    )

    });

    if(correctNum == 0){
        const responseJSON = {
            message: 'Pokemon not found by that type in API',
        };
        return respondJSON(request, response, 204, responseJSON);
    }
    else{
        const responseJSON = {
            correctPokemon,
        };
        return respondJSON(request, response, 200, responseJSON);
    }
    
};




const userError = (request, response) => {
    const responseJSON = {
        message: 'Required parameters are missing',
        id: 'userMissingParameters',
    };

    return respondJSON(request, response, 400, responseJSON);
};

const getNotFound = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found.',
        id: 'notFound',
    };

  respondJSON(request, response, 404, responseJSON);
};

module.exports = {
    getByName,
    getByType,
    getByNumber,
    getNotFound,
};
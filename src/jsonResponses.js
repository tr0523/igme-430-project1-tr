const pokedexSource = require('./pokedex.json');

//Sets up the pokedex data for the entire runtime
const pokedexString = JSON.stringify(pokedexSource);
const pokedex = JSON.parse(pokedexString);

//Writes the JSON response, leaving out the body if it is in response to a HEAD request
//status is the status code
//object is the body of the response
const respondJSON = (request, response, status, object) => {
    const content = JSON.stringify(object);

    const headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    };

    response.writeHead(status, headers);

    //Code snippet is found on the reference guide for HEAD Requests
    //Specifically at https://github.com/IGM-RichMedia-at-RIT/igme-430-shared/blob/main/reference/http/head-requests.md
    if(request.method !== 'HEAD'){
        response.write(content);
    }

    response.end();
};

//Retrieves a pokemon based on the name input
const getByName = (request, response) => {
    let currentStatus = 204;
    let responseJSON = {
        message: 'Pokemon not found by that name in API',
        id: 'noResults',
    };
    
    pokedex.forEach(pokemon => {
        if(pokemon.name == request.query.name){
            responseJSON = pokemon;   
            currentStatus = 200;
        }
    });

    return respondJSON(request, response, currentStatus, responseJSON);
    
};

//Retrieves the pokemon with the type input
const getByType = (request, response) => {
    let correctPokemon = {};
    let correctNum = 0

    pokedex.forEach(pokemon => {
        pokemon.type.forEach(type => {
            if(type == request.query.type){
                correctPokemon[correctNum] = pokemon;
                correctNum++;
            }
        })
    });

    if(correctNum == 0){
        const responseJSON = {
            message: 'Pokemon not found by that type in API',
            id: 'noResults',
        };
        return respondJSON(request, response, 204, responseJSON);
    }
    else{
        const responseJSON = correctPokemon;
        return respondJSON(request, response, 200, responseJSON);
    }
    
};

//Retrieves a pokemon based on the number input
const getByNumber = (request, response) => {
    if(!pokedex[request.query.number-1]){
        if(request.query.number == ""){
            return userError(request,response);
        }
        else{
            const responseJSON = {
                message: 'Pokemon not found by that number in API',
                id: 'noResults',
            };
            return respondJSON(request, response, 204, responseJSON);
        }
    }
    else{

    const pokemon = pokedex[request.query.number-1];
    const responseJSON = pokemon;   
    return respondJSON(request, response, 200, responseJSON);
    }
};

//Retrieves the pokemon with the weakness input
const getByWeakness = (request, response) => {
    let correctPokemon = {};
    let correctNum = 0

    pokedex.forEach(pokemon => {
        pokemon.weaknesses.forEach(weakness => {
            if(weakness == request.query.weakness){
                correctPokemon[correctNum] = pokemon;
                correctNum++;
            }
        })
    });

    if(correctNum == 0){
        const responseJSON = {
            message: 'Pokemon not found with that weakness in API',
            id: 'noResults',
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

//Edits a pokemon's height to be the input height and retrieves that pokemon
const updateHeight = (request, response) => {
    const { inputField, newInfo } = request.body;
    if(!pokedex[inputField-1]){
        if(inputField == ""){
            return userError(request,response);
        }
        else{
            const responseJSON = {
                message: 'Pokemon not found by that number in API',
                id: 'noResults',
            };
            return respondJSON(request, response, 204, responseJSON);
        }
    }
    else{

    pokedex[inputField-1].height = newInfo;
    const pokemon = pokedex[inputField-1];

    const responseJSON = pokemon;   
    return respondJSON(request, response, 200, responseJSON);
    }
};

//Edits a pokemon's weight to be the input weight and retrieves that pokemon
const updateWeight = (request, response) => {
    const { inputField, newInfo } = request.body;
    if(!pokedex[inputField-1]){
        if(inputField == ""){
            return userError(request,response);
        }
        else{
            const responseJSON = {
                message: 'Pokemon not found by that number in API',
                id: 'noResults',
            };
            return respondJSON(request, response, 204, responseJSON);
        }
    }
    else{

    pokedex[inputField-1].weight = newInfo;
    const pokemon = pokedex[inputField-1];

    const responseJSON = pokemon;   
    return respondJSON(request, response, 200, responseJSON);
    }
};

//Returns an error for if not all parameters are input
const userError = (request, response) => {
    const responseJSON = {
        message: 'Required parameters are missing',
        id: 'userMissingParameters',
    };

    return respondJSON(request, response, 400, responseJSON);
};


//Returns if a nonexistent request is mmade
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
    getByWeakness,
    updateHeight,
    updateWeight,
    getNotFound,
};
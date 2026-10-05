const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const pokedexSource = require('./pokedex.json');

const pokedexString = JSON.stringify(pokedexSource);
var pokedex = JSON.parse(pokedexString);

const port = process.env.PORT || process.env.NODE_PORT || 3000;


/*
const bodyString = Buffer.concat(body).toString();
        const type = request.headers['content-type'];
        request.body = JSON.parse(bodyString);
*/

const onRequest = (request, response) => {
    console.log(request.url);

    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    switch (parsedUrl.pathname){
        case '/':
            jsonHandler.getByNumber(request,response,100);
            break;
        case '/home':
            htmlHandler.getIndex(request, response);
            break;
        case '/documentation':
            htmlHandler.getIndex(request, response);
            break;
        case '/style.css':
            htmlHandler.getCSS(request, response);
            break;
        case '/getByName':
            jsonHandler.getByName(request, response,"Bulbasaur");
            break;
        case '/getByType':
            jsonHandler.getByType(request, response,"Grass");
            break;
        case '/getByNumber':
            jsonHandler.getByNumber(request, response);
            break;
        case '/getByStage':
            jsonHandler.getByStage(request, response);
            break;
        case '/notReal':
            jsonHandler.getNotFound(request, response);
            break;
        default:
            jsonHandler.getNotFound(request, response);
            break;
    }
};

http.createServer(onRequest).listen(port, () =>{
    console.log(`Listening on 127.0.0.1:${port}`);
});
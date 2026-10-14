const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

//Parses the body of POST methods, and does so based on the content type of the data
//handler is the handler that the request is passed to after the parsing
const parseBody = (request, response, handler) => {
    const body = [];

    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    request.on('data', (chunk) => {
        body.push(chunk);
    });

    request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();

        
        //From here to the next * is code found on the reference guide for parsing a POST body
        //Specifically at https://github.com/IGM-RichMedia-at-RIT/igme-430-shared/blob/main/reference/http/parsing-post-body.md
        const type = request.headers['content-type'];
        if (type === 'application/x-www-form-urlencoded') {
            request.body = request.query.parse(bodyString);
        } else if (type === 'application/json') {
            request.body = JSON.parse(bodyString);
        } else {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify({ error: 'invalid data format' }));
            return response.end();
        }
        // *

        handler(request, response);
    });
};

//Handles requests, and passes them along to the handlers
const onRequest = (request, response) => {
    console.log(request.url);

    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    //From Assignment Feedback for the HTTP API Assignment
    //Specifically at https://mycourses.rit.edu/d2l/lms/dropbox/user/folder_user_view_feedback.d2l?db=2259105&grpid=0&isprv=0&bp=0&ou=1231403
    request.query = Object.fromEntries(parsedUrl.searchParams);

    switch (parsedUrl.pathname){
        case '/':
            htmlHandler.getIndex(request, response);
            break;
        case '/home':
            htmlHandler.getIndex(request, response);
            break;
        case '/documentation':
            htmlHandler.getDocumentation(request, response);
            break;
        case '/style.css':
            htmlHandler.getCSS(request, response);
            break;
        case '/getByName':
            jsonHandler.getByName(request, response);
            break;
        case '/getByType':
            jsonHandler.getByType(request, response);
            break;
        case '/getByNumber':
            jsonHandler.getByNumber(request, response);
            break;
        case '/getByWeakness':
            jsonHandler.getByWeakness(request, response);
            break;
        case '/updateHeight':
            parseBody(request,response,jsonHandler.updateHeight);
            break;
        case '/updateWeight':
            parseBody(request,response,jsonHandler.updateWeight);
            break;
        case '/notReal':
            jsonHandler.getNotFound(request, response);
            break;
        default:
            jsonHandler.getNotFound(request, response);
            break;
    }
};

//Creates the server
http.createServer(onRequest).listen(port, () =>{
    console.log(`Listening on 127.0.0.1:${port}`);
});
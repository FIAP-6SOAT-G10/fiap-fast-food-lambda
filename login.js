var http = require('http');

module.exports.login = async (event) => {
    let rawBody = JSON.stringify(event.body);
    let body = JSON.parse(rawBody);
    let username = JSON.parse(body).username;
    return init(username);
}

function init(username) {
    var options = {
        host: 'localhost',
        port: '30000',
        path: `/api/clientes?cpf=${username}`,
        method: 'GET'
    };

    console.log(`${username}`);
    var req = http.get(options, function(res) {
        if (res.statusCode != 200) {
            console.log('Usuário não encontrado');
            return;
        }
        
        //chamada ao próximo AWS Lambda
    });
}
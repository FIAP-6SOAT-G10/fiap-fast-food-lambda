var http = require('http');

module.exports.login = async (event) => {
    let rawBody = JSON.stringify(event.body);
    let body = JSON.parse(rawBody);
    let username = JSON.parse(body).username;
    return init(username);
}

function init(username) {
    var options = {
        host: 'http://a8fa75205608242ebaff09f4ff8cb7c3-1746343393.us-east-1.elb.amazonaws.com',
        port: '80',
        path: `/api/clientes?cpf=${username}`,
        method: 'GET'
    };

    console.log(`${username}`);
    var req = http.get(options, function(res) {
        if (res.statusCode != 200) {
            console.log('Usuário não encontrado');
            return;
        }

        console.log('Response from Server: ' + res);
        
        //chamada ao próximo AWS Lambda
    });
}
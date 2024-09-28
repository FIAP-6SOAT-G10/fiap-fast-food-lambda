var http = require('http');
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

module.exports.login = async (event) => {
    let rawBody = JSON.stringify(event.body);
    let body = JSON.parse(rawBody);
    let username = JSON.parse(body).username;
    return await login(username);
}

const fetchPublicData = (url) => {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (data == null || !data || data == '') {
            data = JSON.stringify([{ cpf: '99999999999' }]);
        }
        resolve(JSON.parse(data));
      });

    }).on('error', (err) => {
      reject(err);
    });
  });
};

const postData = (url, postData) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(postData);

    const { hostname, pathname } = new URL(url);

    const options = {
      hostname: hostname,
      path: pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(responseData));
        } catch (error) {
          reject(new Error('Erro ao analisar a resposta JSON'));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(data);
    req.end();
  });
};

const callFetchPublicData = async (username) => {
  const url = `http://a8fa75205608242ebaff09f4ff8cb7c3-1746343393.us-east-1.elb.amazonaws.com/api/clientes?cpf=${username}`;
  try {
    return await fetchPublicData(url);
  } catch (error) {
    console.error('Erro ao fazer a chamada:', error);
  }
};

const callPostData = async (username) => {
  const payload = {
    username: username
  }
  const client = new LambdaClient();
  const input = {
    FunctionName: "auth",
    InvocationType: "RequestResponse",
    LogType: "Tail",
    Payload: JSON.stringify(payload)
  };

  const command = new InvokeCommand(input);
  const response = await client.send(command);

  const decoder = new TextDecoder("utf-8");

  const creation = JSON.parse(decoder.decode(response.Payload));
  return creation;
};

const login = async (username) => {
    const response = await callFetchPublicData(username);
    let body = JSON.parse(JSON.stringify(response))[0];

    return await callPostData(body.cpf);
}
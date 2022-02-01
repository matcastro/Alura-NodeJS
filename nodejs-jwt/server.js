require('dotenv').config()
const app = require('./app');
const port = 3000;
const db = require('./database');

require('./redis/blocklist-access-token')
require('./redis/allowlist-refresh-token')
const { InvalidArgumentError, NaoEncontrado, NaoAutorizado } = require('./src/erros')
const { ConversorErro } = require('./src/conversores')
const jwt = require('jsonwebtoken')

app.use((req, res, proximo) => {
    const accept = req.get('Accept')

    if (accept.indexOf('application/json') === -1 && accept.indexOf('*/*') === -1) {
        res.status(406)
        res.end()
        return
    }

    res.set({
        'Content-Type': 'application/json'
    })
    proximo()
})

const routes = require('./rotas');
routes(app);

app.use((erro, req, res, proximo) => {
    let status = 500
    const corpo = {
        mensagem: erro.message
    }
    const conversor = new ConversorErro('json')

    if(erro instanceof InvalidArgumentError){
        status = 400
    }
    else if(erro instanceof jwt.JsonWebTokenError){
        status = 401
    }
    else if (erro instanceof jwt.TokenExpiredError){
        status = 401,
        corpo.expiradoEm = erro.expiredAt
    }
    else if (erro instanceof NaoEncontrado){
        status = 404
    }
    else if (erro instanceof NaoAutorizado){
        status = 401
    }

    res.status(status)
    res.send(conversor.converter(corpo))
})

app.listen(port, () => console.log(`App listening on port ${port}`));

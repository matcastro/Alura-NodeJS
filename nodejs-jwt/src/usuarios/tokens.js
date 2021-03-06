const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const moment = require('moment');
const allowlistRefreshToken = require('../../redis/allowlist-refresh-token');
const blocklistAccessToken = require('../../redis/blocklist-access-token')
const listaRedefinicao = require('../../redis/listaRedefinicaoDeSenha')
const {InvalidArgumentError} = require('../erros')

function criaTokenJWT(id, [tempoQuantidade, tempoUnidade]){
    const payload = {
        id: id
    }

    const token = jwt.sign(payload, process.env.CHAVE_JWT, { expiresIn: `${tempoQuantidade}${tempoUnidade}`})
    return token
}

async function verificaTokenJWT(token, nome, blocklist){
    await verificaTokenNaBlocklist(token, nome, blocklist)
    const {id} = jwt.verify(token, process.env.CHAVE_JWT)
    return id
}

async function verificaTokenNaBlocklist(token, nome, blocklist){
    if(!blocklist){
        return
    }
    if(await blocklist.contemToken(token)) {
        throw new jwt.JsonWebTokenError(`${nome} inválido por logout!`)
    }
}

function invalidaTokenJWT(token, blocklist){
    return blocklist.adiciona(token)
}

async function criaTokenOpaco(id, [tempoQuantidade, tempoUnidade], allowlist) {
    const tokenOpaco = crypto.randomBytes(24).toString('hex')
    const dataExpiracao = moment().add(tempoQuantidade, tempoUnidade).unix()
    await allowlist.adiciona(tokenOpaco, id, dataExpiracao)
    return tokenOpaco
}

async function verificaTokenOpaco(token, nome, allowlist){
    verificaTokenValido(token, nome);
    const id = await allowlist.buscaValor(token)
    verificaTokenEnviado(id, nome);
    return id
}

function verificaTokenEnviado(id, nome) {
    if (!id) {
        throw new InvalidArgumentError(`${nome} token inválido!`);
    }
}

function verificaTokenValido(token, nome) {
    if (!token) {
        throw new InvalidArgumentError(`${nome} não enviado!`);
    }
}

async function invalidaTokenOpaco(token, allowlist){
    await allowlist.deletaChave(token)
}

module.exports = {
    access: {
        nome: 'access token',
        lista: blocklistAccessToken,
        expiracao: [15, 'm'],
        cria(id) { 
            return criaTokenJWT(id, this.expiracao)
        },
        verifica(token){
            return verificaTokenJWT(token, this.nome, this.lista)
        },
        invalida(token){
            return invalidaTokenJWT(token, this.lista)
        }
    },

    refresh: {
        nome: 'refresh token',
        lista: allowlistRefreshToken,
        expiracao: [5, 'd'],
        cria(id) {
            return criaTokenOpaco(id, this.expiracao, this.lista)
        },
        verifica(token){
            return verificaTokenOpaco(token, this.nome, this.lista)  
        },
        invalida(token){
            return invalidaTokenOpaco(token, this.lista)
        }
    },

    verificacaoEmail: {
        nome: 'token de verificacao de e-mail',
        expiracao: [1, 'h'],
        cria(id) { 
            return criaTokenJWT(id, this.expiracao)
        },
        verifica(token){
            return verificaTokenJWT(token, this.nome)
        }
    },

    redefinicaoDeSenha: {
        nome: 'token de redefinição de senha',
        lista: listaRedefinicao,
        expiracao: [1, 'h'],
        cria(id) { 
            return criaTokenOpaco(id, this.expiracao, this.lista)
        },
        verifica(token){
            return verificaTokenOpaco(token, this.nome, this.lista)
        },
        invalida(token){
            return invalidaTokenOpaco(token, this.lista)
        }
    }
}

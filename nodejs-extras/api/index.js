const express = require('express')
const app = express()
const config = require('config')
const roteador = require('./rotas/filmes')

app.use(express.json())

app.use('/api/filmes', roteador)

app.listen(config.get('api.porta'), () => {
    console.log('A API está funcionando')
})
const roteador = require('express').Router()
const TabelaFilme = require('./TabelaFilme')

roteador.use('/', async (req, res) => {
    const resultados = await TabelaFilme.listar()
    res.json(resultados)
})

module.exports = roteador
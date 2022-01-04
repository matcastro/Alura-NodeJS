const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')

roteador.get('/', async (req, res) => {
    const resultados = await TabelaFornecedor.listar()
    res.json(resultados)
})

roteador.post('/', async (req, res) => {
    const dadosRecebidos = req.body
    const fornecedor = new Fornecedor(dadosRecebidos)
    await fornecedor.criar()

    res.json(fornecedor)
})

roteador.get('/:idFornecedor', async (req, res) => {
    try{
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id })
        await fornecedor.carregar()
        res.json(fornecedor)
    } catch (erro){
        res.json({
            mensagem: erro.message
        }).status(400)
    }
})

roteador.put('/:idFornecedor', async (req, res) => {
    try{
        const id = req.params.idFornecedor
        const dadosRecebidos = req.body
        const fornecedor = new Fornecedor({ id, ...dadosRecebidos })
        await fornecedor.atualizar()
        res.end()    
    } catch(erro) {
        res.json({mensagem: erro.message}).status(400)
    }
    
})

module.exports = roteador
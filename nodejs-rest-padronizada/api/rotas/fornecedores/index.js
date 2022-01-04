const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')

roteador.get('/', async (req, res) => {
    const resultados = await TabelaFornecedor.listar()
    res.json(resultados)
})

roteador.post('/', async (req, res, proximo) => {
    try{
        const dadosRecebidos = req.body
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
    
        res
            .status(201)
            .json(fornecedor)
    } catch (erro) {
        proximo(erro)
    }
})

roteador.get('/:idFornecedor', async (req, res, proximo) => {
    try{
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id })
        await fornecedor.carregar()
        res.json(fornecedor)
    } catch (erro){
        proximo(erro)
    }
})

roteador.put('/:idFornecedor', async (req, res, proximo) => {
    try{
        const id = req.params.idFornecedor
        const dadosRecebidos = req.body
        const fornecedor = new Fornecedor({ id, ...dadosRecebidos })
        await fornecedor.atualizar()
        res
            .status(204)
            .end()    
    } catch(erro) {
        proximo(erro)
    }
    
})

roteador.delete('/:idFornecedor', async (req, res, proximo) => {
    try{
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id })
        await fornecedor.carregar()
        await fornecedor.remover()
        res
            .status(204)
            .end()    
    } catch(erro) {
        proximo(erro)
    }
    
})

module.exports = roteador
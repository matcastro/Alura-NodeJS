const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')

roteador.get('/', async (req, res) => {
    const resultados = await TabelaFornecedor.listar()
    res.json(resultados)
})

roteador.post('/', async (req, res) => {
    try{
        const dadosRecebidos = req.body
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
    
        res
            .status(201)
            .json(fornecedor)
    } catch (erro) {
        res
            .status(400)
            .json({mensagem: erro.message})
    }
})

roteador.get('/:idFornecedor', async (req, res) => {
    try{
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id })
        await fornecedor.carregar()
        res.json(fornecedor)
    } catch (erro){
        res
            .status(404)
            .json({
                mensagem: erro.message
            })
    }
})

roteador.put('/:idFornecedor', async (req, res) => {
    try{
        const id = req.params.idFornecedor
        const dadosRecebidos = req.body
        const fornecedor = new Fornecedor({ id, ...dadosRecebidos })
        await fornecedor.atualizar()
        res
            .status(204)
            .end()    
    } catch(erro) {
        res
            .status(400)
            .json({mensagem: erro.message})
    }
    
})

roteador.delete('/:idFornecedor', async (req, res) => {
    try{
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id })
        await fornecedor.carregar()
        await fornecedor.remover()
        res
            .status(204)
            .end()    
    } catch(erro) {
        res
            .status(404)
            .json({mensagem: erro.message})
    }
    
})

module.exports = roteador
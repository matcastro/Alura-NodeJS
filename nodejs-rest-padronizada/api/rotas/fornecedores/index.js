const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

roteador.get('/', async (req, res) => {
    const resultados = await TabelaFornecedor.listar()
    const serializador = new SerializadorFornecedor(
        res.getHeader('Content-Type')
    )
    res.send(serializador.serializar(resultados))
})

roteador.post('/', async (req, res, proximo) => {
    try{
        const dadosRecebidos = req.body
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
    
        const serializador = new SerializadorFornecedor(
            res.getHeader('Content-Type')
        )
        res
            .status(201)
            .send(serializador.serializar(fornecedor))
    } catch (erro) {
        proximo(erro)
    }
})

roteador.get('/:idFornecedor', async (req, res, proximo) => {
    try{
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id })
        await fornecedor.carregar()
        const serializador = new SerializadorFornecedor(
            res.getHeader('Content-Type'),
            ['email', 'dataCriacao', 'dataAtualizacao', 'versao']
        )
        res.send(serializador.serializar(fornecedor))
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

const roteadorProdutos = require('./produtos')
roteador.use('/:idFornecedor/produtos', roteadorProdutos)

module.exports = roteador
const roteador = require('express').Router({ mergeParams: true })
const Tabela = require('./TabelaProduto')
const Produto = require('./Produto')
const SerializadorProduto = require('../../../Serializador').SerializadorProduto

roteador.get('/', async (req, res) => {
    const produtos = await Tabela.listar(req.fornecedor.id)
    const serializador = new SerializadorProduto(
        res.getHeader('Content-Type')
    )
    res.send(
        serializador.serializar(produtos)
    )
})

roteador.post('/', async (req, res, proximo) => {
    try {
        const idFornecedor = req.fornecedor.id
        const corpo = req.body
        const dados = {
            fornecedor: idFornecedor,
            ...corpo
        }
        const produto = new Produto(dados)
        await produto.criar()
        const serializador = new SerializadorProduto(
            res.getHeader('Content-Type')
        )
        res
            .status(201)
            .send(serializador.serializar(produto))
    } catch (erro){
        proximo(erro)
    }
})

roteador.delete('/:id', async(req, res) => {
    const dados = {
        id: req.params.id,
        fornecedor: req.fornecedor.id
    }

    const produto = new Produto(dados)
    await produto.apagar()
    res
        .status(204)
        .end()
})

roteador.get('/:id', async (req, res, proximo) => {
    try{
        const dados = {
            id: req.params.id,
            fornecedor: req.fornecedor.id
        }
    
        const produto = new Produto(dados)
        await produto.carregar()
        const serializador = new SerializadorProduto(
            res.getHeader('Content-Type'),
            ['preco', 'estoque', 'fornecedor', 'dataCriacao', 'dataAtualizacao', 'versao']
        )
        res.send(serializador.serializar(produto))
    } catch (erro){
        proximo(erro)
    }
})

roteador.put('/:id', async (req, res, proximo) => {
    try{
        const dados = {
            id: req.params.id,
            fornecedor: req.fornecedor.id,
            ...req.body
        }
    
        const produto = new Produto(dados)
        await produto.atualizar()
        res
            .status(204)
            .end()
    } catch(erro){
        proximo(erro)
    }
})

roteador.post('/:id/diminuir-estoque', async (req, res, proximo) => {
    try {
        const produto = new Produto({
            id: req.params.id,
            fornecedor: req.fornecedor.id
        })

        await produto.carregar()
        produto.estoque = produto.estoque - req.body.quantidade
        await produto.diminuirEstoque()

        res
            .status(204)
            .end()
    } catch (erro){
        proximo(erro)
    }
})

const roteadorReclamacoes = require('./reclamacoes')
roteador.use('/:idProduto/reclamacoes', roteadorReclamacoes)

module.exports = roteador
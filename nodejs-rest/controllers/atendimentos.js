const Atendimento = require('../models/atendimentos')
module.exports = app => {
    app.get('/atendimentos', (_, res) => {
        Atendimento.lista()
            .then(resultado => {
                res.json(resultado)
            })
            .catch(erro => {
                res.status(400).json(erro)
            })
    })

    app.get('/atendimentos/:id', (req, res) => {
        Atendimento.buscaPorId(req.params.id)
            .then(resultado => {
                res.json(resultado)
            })
            .catch(erro => {
                res.status(400).json(erro)
            })
    })


    app.post('/atendimentos', (req, res) => {
        const atendimento = req.body
        Atendimento.adiciona(atendimento)
            .then(atendimentoCadastrado => {
                res.status(201).json(atendimentoCadastrado)
            })
            .catch(error => {
                res.status(400).json(error)
            })
    })

    app.patch('/atendimentos/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const valores = req.body
        Atendimento.altera(id, valores)
            .then(alteracoes => {
                res.json(alteracoes)
            })
            .catch(error => {
                res.status(400).json(error)
            })
    })

    app.delete('/atendimentos/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Atendimento.deleta(id)
            .then((resultado) => {
                res.json(resultado)
            })
            .catch(error => {
                res.status(400).json(error)
            })
    })
}
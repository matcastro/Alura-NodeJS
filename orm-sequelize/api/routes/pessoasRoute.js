const { Router } = require('express')
const PessoaController = require('../controllers/PessoaController')

const router = Router()

router
    .get('/pessoas', PessoaController.pegaPessoasAtivas)
    .get('/pessoas/todos', PessoaController.pegaTodasAsPessoas)
    .get('/pessoas/:id', PessoaController.pegaUmaPessoa)
    .get('/pessoas/:estudanteId/matriculas/:matriculaId', PessoaController.pegaUmaMatricula)
    .get('/pessoas/:estudanteId/matriculas', PessoaController.pegaMatriculas)
    .post('/pessoas', PessoaController.criaPessoa)
    .put('/pessoas/:id', PessoaController.atualizaPessoa)
    .delete('/pessoas/:id', PessoaController.apagaPessoa)
    .post('/pessoas/:id/restaura', PessoaController.restauraPessoa)
    .post('/pessoas/:estudanteId/matriculas', PessoaController.criaMatricula)
    .put('/pessoas/:estudanteId/matriculas/:matriculaId', PessoaController.atualizaMatricula)
    .delete('/pessoas/:estudanteId/matriculas/:matriculaId', PessoaController.apagaMatricula)
    .post('/pessoas/:estudanteId/matriculas/:matriculaId/restaura', PessoaController.restauraMatricula)

module.exports = router;
const { Router } = require('express')
const TurmaController = require('../controllers/TurmaController')
 
const router = Router()
router
 .get('/turmas', TurmaController.pegaTodasAsTurmas)
 .get('/turmas/:id', TurmaController.pegaUmaTurma)
 .get('/turmas/:id/matriculas', TurmaController.pegaMatriculasPorTurma)
 .get('/turmas/matriculas/lotadas', TurmaController.pegaTurmasLotadas)
 .post('/turmas', TurmaController.criaTurma)
 .put('/turmas/:id', TurmaController.atualizaTurma)
 .delete('/turmas/:id', TurmaController.apagaTurma)
 .post('/turmas/:id/restaura', TurmaController.restauraTurma)
module.exports = router
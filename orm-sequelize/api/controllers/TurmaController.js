// const database = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { TurmasServices } = require('../services')
const turmasServices = new TurmasServices()

class TurmaController {
  static async pegaTodasAsTurmas(req, res){
    try {
      const { data_inicial, data_final } = req.query
      const where = {}
      data_inicial || data_final ? where.data_inicio = {} : null
      data_inicial ? where.data_inicio[Op.gte] = data_inicial : null
      data_final ? where.data_inicio[Op.lte] = data_final : null
      const todasAsTurmas = await turmasServices.pegaTodosOsRegistros(where)
      return res.status(200).json(todasAsTurmas)  
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaUmaTurma(req, res) {
    const { id } = req.params
    try {
      const umaTurma = await turmasServices.pegaUmRegistro(id)
      return res.status(200).json(umaTurma)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async criaTurma(req, res) {
    const novaTurma = req.body
    try {
      const novaTurmaCriada = await turmasServices.criaRegistro(novaTurma)
      return res.status(200).json(novaTurmaCriada)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async atualizaTurma(req, res) {
    const { id } = req.params
    const novasInfos = req.body
    try {
      await turmasServices.atualizaRegistro(novasInfos, id)
      const turmaAtualizada = await turmasServices.pegaUmRegistro(id)
      return res.status(200).json(turmaAtualizada)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async apagaTurma(req, res) {
    const { id } = req.params
    try {
      await turmasServices.apagaRegistro(id)
      return res.status(200).json({ mensagem: `id ${id} deletado` })

    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async restauraTurma(req, res) {
    try{
        const { id } = req.params
        await turmasServices.restauraRegistro(id)
        return res
                  .status(204)
                  .end()
    } catch(error){
        return res
                  .status(500)
                  .json(error.message)
    }
  }

  static async pegaMatriculasPorTurma(req, res) {
    try{
        const { id } = req.params
        const todasAsMatriculas = await turmasServices.matriculas.pegaEContaRegistros({
              turma_id: Number(id),
              status: 'confirmado'
            },
            {
              limit: 2,
              order: [['estudante_id', 'DESC']]
            }
        )

        return res.json(todasAsMatriculas)
    } catch(error){
        return res
                  .status(500)
                  .json(error.message)
    }
  }

  static async pegaTurmasLotadas(req, res) {
    try{
        const lotacaoTurma = 2
        const turmasLotadas = await turmasServices.matriculas.pegaEContaRegistros({
                status: 'confirmado'
            },
            {
              attributes: ['turma_id'],
              group: ['turma_id'],
              having: Sequelize.literal(`count(turma_id) >= ${lotacaoTurma}`)
            }
        )

        return res.json(turmasLotadas.count)
    } catch(error){
        return res
                  .status(500)
                  .json(error.message)
    }
  }

}

module.exports = TurmaController
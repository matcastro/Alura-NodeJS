const database = require('../models')

class PessoaController {
    static async pegaPessoasAtivas(req, res) {
        try{
            const pessoasAtivas = await database.Pessoas.findAll()
            return res.json(pessoasAtivas)
        } catch(error){
            return res
                      .status(500)
                      .json(error.message)
        }   
    }

    static async pegaTodasAsPessoas(req, res) {
        try{
            const todasAsPessoas = await database.Pessoas.scope('todos').findAll()
            return res.json(todasAsPessoas)
        } catch(error){
            return res
                      .status(500)
                      .json(error.message)
        }   
    }

    static async pegaUmaPessoa(req, res) {
        try{
            const { id } = req.params
            const umaPessoa = await database.Pessoas.findOne( {
                where: {
                    id: Number(id)
                }
            })
            return res.json(umaPessoa)
        } catch(error){
            return res
                      .status(500)
                      .json(error.message)
        }
    }

    static async criaPessoa(req, res) {
        try{
            const novaPessoa = req.body
            const novaPessoaCriada = await database.Pessoas.create(novaPessoa)
            return res.json(novaPessoaCriada)
        } catch(error){
            return res
                      .status(500)
                      .json(error.message)
        }
    }

    static async apagaPessoa(req, res) {
        try{
            const { id } = req.params
            await database.Pessoas.destroy({
                where:{
                    id: Number(id)
                }
            })
            return res.status(204).end()
        } catch(error){
            return res
                      .status(500)
                      .json(error.message)
        }
    }

    static async atualizaPessoa(req, res) {
        try{
            const { id } = req.params
            const novasInfos = req.body
            await database.Pessoas.update(novasInfos, {
                where: {
                    id: Number(id)
                }
            })

            const pessoaAtualizada = await database.Pessoas.findOne({
                where: {
                    id: Number(id)
                }
            })
            return res.json(pessoaAtualizada)
        } catch(error){
            return res
                      .status(500)
                      .json(error.message)
        }
    }

    static async apagaPessoa(req, res) {
        try{
            const { id } = req.params
            await database.Pessoas.destroy({
                where:{
                    id: Number(id)
                }
            })
            return res.status(204).end()
        } catch(error){
            return res
                      .status(500)
                      .json(error.message)
        }
    }

    static async restauraPessoa(req, res) {
        try{
            const { id } = req.params
            await database.Pessoas.restore({
                where:{
                    id: Number(id)
                }
            })
            return res
                      .status(204)
                      .end()
        } catch(error){
            return res
                      .status(500)
                      .json(error.message)
        }
    }

    static async pegaUmaMatricula(req, res) {
        try{
            const { estudanteId, matriculaId } = req.params
            const umaMatricula = await database.Matriculas.findOne( {
                where: {
                    id: Number(matriculaId),
                    estudante_id: Number(estudanteId)
                }
            })
            return res.json(umaMatricula)
        } catch(error){
            return res
                      .status(500)
                      .json(error.message)
        }
    }

    static async criaMatricula(req, res) {
        try{
            const { estudanteId } = req.params
            const novaMatricula = { estudante_id: Number(estudanteId), ...req.body }
            const novaMatriculaCriada = await database.Matriculas.create(novaMatricula)
            return res.json(novaMatriculaCriada)
        } catch(error){
            return res
                      .status(500)
                      .json(error.message)
        }
    }

    static async atualizaMatricula(req, res) {
        try{
            const { estudanteId, matriculaId } = req.params
            const novasInfos = req.body
            await database.Matriculas.update(novasInfos, {
                where: {
                    id: Number(matriculaId),
                    estudante_id: Number(estudanteId)
                }
            })

            const matriculaAtualizada = await database.Matriculas.findOne({
                where: {
                    id: Number(matriculaId)
                }
            })
            return res.json(matriculaAtualizada)
        } catch(error){
            return res
                      .status(500)
                      .json(error.message)
        }
    }

    static async apagaMatricula(req, res) {
        try{
            const { estudanteId, matriculaId } = req.params
            await database.Matriculas.destroy({
                where:{
                    id: Number(matriculaId),
                    estudante_id: estudanteId
                }
            })
            return res.status(204).end()
        } catch(error){
            return res
                      .status(500)
                      .json(error.message)
        }
    }

    static async restauraMatricula(req, res) {
        try{
            const { estudanteId, matriculaId } = req.params
            await database.Matriculas.restore({
                where:{
                    id: Number(matriculaId),
                    estudante_id: estudanteId
                }
            })
            return res
                      .status(204)
                      .end()
        } catch(error){
            return res
                      .status(500)
                      .json(error.message)
        }
    }

    static async pegaMatriculas(req, res) {
        try{
            const { estudanteId } = req.params
            const pessoa = await database.Pessoas.findOne({
                where:{
                    id: Number(estudanteId)
                }
            })

            const matriculas = await pessoa.getAulasMatriculadas()
            return res.json(matriculas)
        } catch(error){
            return res
                      .status(500)
                      .json(error.message)
        }
    }

    static async cancelaPessoa(req, res) {
        try{
            const { estudanteId } = req.params
            database.sequelize.transaction(async transacao => {
                await database.Pessoas.update({
                    ativo: false
                }, {
                    where: {
                        id: Number(estudanteId)
                    }
                }, {
                    transaction: transacao
                })
                await database.Matriculas.update({
                    status: 'cancelado'
                },
                {
                    where: {
                        estudante_id: Number(estudanteId)
                    }
                }, {
                    transaction: transacao
                })
            })

            return res
                      .status(204)
                      .end()
        } catch(error){
            return res
                      .status(500)
                      .json(error.message)
        }
    }
}

module.exports = PessoaController
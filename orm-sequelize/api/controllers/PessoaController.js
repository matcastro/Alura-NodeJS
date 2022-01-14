// const database = require('../models')

const { PessoasServices } = require('../services')
const pessoasServices = new PessoasServices()

class PessoaController {
    static async pegaPessoasAtivas(req, res) {
        try{
            const pessoasAtivas = await pessoasServices.pegaRegitrosAtivos()
            return res.json(pessoasAtivas)
        } catch(error){
            return res
                      .status(500)
                      .json(error.message)
        }   
    }

    static async pegaTodasAsPessoas(req, res) {
        try{
            const todasAsPessoas = await pessoasServices.pegaTodosOsRegistros()
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
            const umaPessoa = await pessoasServices.pegaUmRegistro(id)
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
            const novaPessoaCriada = await pessoasServices.criaRegistro(novaPessoa)
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
            await pessoasServices.apagaRegistro(id)
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
            await pessoasServices.atualizaRegistro(novasInfos, id)

            const pessoaAtualizada = await pessoasServices.pegaUmRegistro(id)
            return res.json(pessoaAtualizada)
        } catch(error){
            return res
                      .status(500)
                      .json(error.message)
        }
    }

    static async restauraPessoa(req, res) {
        try{
            const { id } = req.params
            await pessoasServices.restauraRegistro(id)
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
            const umaMatricula = await pessoasServices.matriculas.pegaUmRegistro(matriculaId, {
                estudante_id: Number(estudanteId)
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
            const novaMatriculaCriada = await pessoasServices.matriculas.criaRegistro(novaMatricula)
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
            await pessoasServices.matriculas.atualizaRegistro(novasInfos, {
                id: Number(matriculaId),
                estudante_id: Number(estudanteId)
            })

            const matriculaAtualizada = await pessoasServices.matriculas.pegaUmRegistro(matriculaId)
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
            await pessoasServices.matriculas.apagaRegistro(matriculaId, {
                estudante_id: estudanteId
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
            await pessoasServices.matriculas.restauraRegistro(matriculaId, {
                id: Number(matriculaId),
                estudante_id: estudanteId
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
            const pessoa = await pessoasServices.pegaUmRegistro(estudanteId)

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
            
            await pessoasServices.cancelaPessoaEMatriculas(Number(estudanteId))

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
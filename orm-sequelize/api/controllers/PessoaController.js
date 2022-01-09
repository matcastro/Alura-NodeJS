const database = require('../models')

class PessoaController {
    static async pegaTodasAsPessoas(req, res) {
        try{
            const todasAsPessoas = await database.Pessoas.findAll()
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
}

module.exports = PessoaController
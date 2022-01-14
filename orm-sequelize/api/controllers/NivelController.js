// const database = require('../models')
const Services = require('../services/Services') 
const niveisServices = new Services('Niveis')

class NivelController {
  static async pegaTodosOsNiveis(req, res){
    try {
      const todosOsNiveis = await niveisServices.pegaTodosOsRegistros()
      return res.status(200).json(todosOsNiveis)  
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaUmNivel(req, res) {
    const { id } = req.params
    try {
      const umNivel = await niveisServices.pegaUmRegistro(id)
      return res.status(200).json(umNivel)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async criaNivel(req, res) {
    const novoNivel = req.body
    try {
      const novoNivelCriado = await niveisServices.criaRegistro(novoNivel)
      return res.status(200).json(novoNivelCriado)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async atualizaNivel(req, res) {
    const { id } = req.params
    const novasInfos = req.body
    try {
      await niveisServices.atualizaRegistro(novasInfos, id)
      const nivelAtualizado = await niveisServices.pegaUmRegistro(id)
      return res.status(200).json(nivelAtualizado)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async apagaNivel(req, res) {
    const { id } = req.params
    try {
      await niveisServices.apagaRegistro(id)
      return res.status(200).json({ mensagem: `id ${id} deletado` })

    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async restauraNivel(req, res) {
    try{
        const { id } = req.params
        await niveisServices.restauraRegistro(id)
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

module.exports = NivelController
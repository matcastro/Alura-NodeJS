const Modelo = require('./ModeloTabelaFilme')

module.exports = {
    listar() {
        return Modelo.findAll()
    }
}
const autorizacao = require('./autorizacao')

module.exports = (entidade, acao) => (req, res, proximo) => {
    if(req.estaAutenticado === true) {
        return autorizacao(entidade, acao)(req, res, proximo)
    }
    proximo()
}
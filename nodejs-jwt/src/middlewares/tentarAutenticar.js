const { middlewaresAutenticacao } = require('../usuarios')

module.exports = (req, res, proximo) => {
    req.estaAutenticado = false
    if(req.get('Authorization')) {
        return middlewaresAutenticacao.bearer(req, res, proximo)
    }
    proximo()
}
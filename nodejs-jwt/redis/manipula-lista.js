const { promisify } = require('util')
module.exports = lista => {
    const existsAsync = promisify(lista.exists).bind(lista)
    const setAsync = promisify(lista.set).bind(lista)
    const getAsync = promisify(lista.get).bind(lista)
    const delAsync = promisify(lista.del).bind(lista)

    return {
        async adiciona(chave, valor, dataExpiracao) {
            await setAsync(chave, valor)
            lista.expireat(chave, dataExpiracao)
        },

        async buscaValor(chave) {
            return getAsync(chave)
        },

        async contemToken(token){
            const resultado = await existsAsync(token)
            return resultado === 1
        },

        async deletaChave(chave){
            await delAsync(chave)
        }
    }
}
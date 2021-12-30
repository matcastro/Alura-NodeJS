const connection = require('./connections')

const executaQuery = (query, parametros = '') => {
    return new Promise((resolve, reject) => {
        connection.query(query, parametros, (error, resultados, campos) => {
            if(error){
                reject(error)
            } else {
                resolve(resultados)
            }
        })
    })    
}

module.exports = executaQuery
const connection = require('../infrastructure/connection')

class Atendimento{
    adiciona(atendimento){
        const sql = 'INSERT INTO Atendimentos SET ?'
        connection.query(sql, atendimento, (error, resultado)=> {
            if(error){
                console.log(error)
            } else{
                console.log(resultado)
            }
        })
    }
}

module.exports = new Atendimento
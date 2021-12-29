const customExpress = require('./configs/customExpress')
const connection = require('./infrastructure/database/connections')
const tables = require('./infrastructure/database/tables')

connection.connect((error) => {
    if(error){
        console.log(error)
    } else{
        console.log('Conectado com sucesso.')

        tables.init(connection)
        const app = customExpress()

        app.listen(3000, () => console.log("servidor rodando na porta 3000"))
    }
}) 


const express = require('express')
const app = express()
const routes = require('./routes')

routes(app)

app.listen(3000, () => console.log('Servidor está rodando na porta 3000'))

module.exports = app
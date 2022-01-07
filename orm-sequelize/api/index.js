const express = require('express')
const app = express()

app.use(express.json())

app.get('/teste', (req, res) => {
    res
        .status(200)
        .send({mensagem: 'boas-vindas à API'})
})

app.listen(3000, () => console.log('Servidor está rodando na porta 3000'))

module.exports = app
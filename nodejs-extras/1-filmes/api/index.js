const express = require('express')
const app = express()

app.use(express.json())

app.get('/api/filmes', (req, res) => {
    const filmes = [
        { nome: 'De volta para o Futuro' },
        { nome: 'Vingadores' },
        { nome: 'Jogos Mortais' }
    ]
    res.json(filmes)
})

app.listen(3001, () => {
    console.log('A API está funcionando e aceitando requisições')
})
const express = require('express')
const app = express()
let jogos = []

app.use(express.json())

app.post('/api/jogos', (req, res) => {
    const jogo = req.body
    try{
        if(jogo.nome && jogo.plataforma){
            jogos.push(jogo)
            res.json(jogo)
        } else{
            throw new Error('Campos inválidos')
        }    
    } catch (erro){
        res.json({mensagem: "Nome e plataforma são campos obrigatórios."})   
    }
})

app.get('/api/jogos', (req, res) => {
    res.json(jogos)
})

app.listen(3002, () => {
    console.log('A API de jogos está funcionando e aceitando requisições')
})
const express = require('express')
const app = express()
let historico = []

app.use(express.json())

app.post('/api/sites', (req, res) => {
    const site = req.body
    try{
        if(site.url && site.dataAcesso){
            historico.push(site)
            res
                .status(201)
                .json(site)
        } else{
            throw new Error('Campos inválidos')
        }    
    } catch (erro){
        res
            .status(400)
            .json({mensagem: "URL e data de acesso são campos obrigatórios."})   
    }
})

app.get('/api/sites', (req, res) => {
    res.json(historico)
})

app.listen(3003, () => {
    console.log('A API de sites está funcionando e aceitando requisições')
})
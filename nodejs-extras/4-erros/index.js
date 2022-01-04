const express = require('express')
const app = express()
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')

app.use(express.json())

app.put('/api/usuarios/:idUsuario', async (requisicao, resposta) => {
    try {
        const dados = requisicao.body
        const id = requisicao.params.idUsuario

        const encontrado = await TabelaDeUsuarios.pegarPorId(id)

        if (!encontrado) {
            throw new NaoEncontrado('Usuário')
        }

        if (dados.nome.length === 0) {
            throw new CampoInvalido('nome')
        }

        const usuario = new Usuario(Object.assign({}, dados, { id: id }))
        await usuario.atualizar()
        resposta.end()
    } catch (erro) {
        resposta.send(JSON.stringify({ mensagem: erro.mensagem }))
    }
})

app.listen(3004, () => {
    console.log('A API está funcionando e aceitando requisições')
})
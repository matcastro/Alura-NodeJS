const ModeloTabela = require('../rotas/filmes/ModeloTabelaFilme')

ModeloTabela
    .sync()
    .then(() => console.log('Tabela criada com sucesso'))
    .catch(console.log)
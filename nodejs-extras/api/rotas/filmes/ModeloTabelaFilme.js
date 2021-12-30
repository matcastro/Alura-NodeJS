const Sequelize = require('sequelize')
const instancia = require('../../banco-de-dados')

const colunas = {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    minutos: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    categoria: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.STRING,
        allowNull: true
    }
}

const opcoes = {
    freezeTableName: true,
    tableName: 'filmes',
    timestamps: true,
    createdAt: 'dataCriacao',
    updatedAt: 'dataAtualizacao',
    version: 'versao'
}

module.exports = instancia.define('filme', colunas, opcoes)
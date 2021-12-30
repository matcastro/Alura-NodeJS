const moment = require('moment')
const connection = require('../infrastructure/database/connections')
const axios = require('axios')
const repositorio = require('../repositories/atendimentos')

class Atendimento {
    constructor() {
        this.dataEhValida = ({ data, dataCriacao }) => moment(data).isSameOrAfter(dataCriacao)
        this.clienteEhValido = ({tamanho}) => {
            return tamanho >= 5
        }
        this.validacoes = [{
            nome: 'data',
            valido: this.dataEhValida,
            mensagem: 'Data deve ser maior ou igual a data atual'
        },
        {
            nome: 'cliente',
            valido: this.clienteEhValido,
            mensagem: 'Cliente deve ter pelo menos cinco caracteres'
        }
        ]

        this.valida = parametros => {
            return this.validacoes.filter(campo => {
                const { nome } = campo
                const parametro = parametros[nome]

                return !campo.valido(parametro)
            })
        }
    }
    adiciona(atendimento) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')

        const parametros = {
            data: { data, dataCriacao },
            cliente: { tamanho: atendimento.cliente.length }
        }
        const erros = this.valida(parametros)
        const existemErros = erros.length

        if (existemErros) {
            return new Promise((_, reject) => {
                reject(erros)
            })
        }
        else {
            const atendimentoDatado = { ...atendimento, dataCriacao, data }

            return repositorio.adiciona(atendimentoDatado)
                .then((resultado) => {
                    const id = resultado.insertId
                    return { id, ...atendimento }
                })
        }
    }

    lista() {
        return repositorio.lista()
    }

    buscaPorId(id) {
        return repositorio.buscaPorId(id)
            .then(async (resultado) => {
                const atendimento = resultado[0]
                const cpf = atendimento.cliente
                const { data } = await axios.get(`http://localhost:8082/${cpf}`)

                atendimento.cliente = data
                return atendimento
            })
    }

    altera(id, valores) {
        if (valores.data) {
            const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss')
            const data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')
            
            const parametros = {
                data: { data, dataCriacao },
                cliente: { tamanho: 5 }
            }
            const erros = this.valida(parametros)
            const existemErros = erros.length

            if (existemErros) {
                return new Promise((_, reject) => {
                    reject(erros)
                })
            } else {
                valores.data = data
            }
        }

        return repositorio.altera([valores, id])
            .then(() => {
                return {id, ...valores}
        })
    }

    deleta(id) {
        return repositorio.deleta(id)
            .then(() => {
                return { id }
            })
    }
}

module.exports = new Atendimento
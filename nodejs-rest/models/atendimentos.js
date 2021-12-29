const moment = require('moment')
const conexao = require('../infrastructure/connections')
const connection = require('../infrastructure/connections')

class Atendimento{
    adiciona(atendimento, res){
        const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')
        
        const dataEhValida = moment(data).isSameOrAfter(dataCriacao)
        const clienteEhValido = atendimento.cliente.length >= 5

        const validacoes = [{
            nome: 'data',
            valido: dataEhValida,
            mensagem: 'Data deve ser maior ou igual a data atual'
        },
        {
            nome: 'cliente',
            valido: clienteEhValido,
            mensagem: 'Cliente deve ter pelo menos cinco caracteres'
        }
        ]

        const erros = validacoes.filter(campo => !campo.valido)
        const existemErros = erros.length

        if(existemErros){
            res.status(400).json(erros)
        }
        else{
            const atendimentoDatado = {...atendimento, dataCriacao, data}
        
            const sql = 'INSERT INTO Atendimentos SET ?'
            
            connection.query(sql, atendimentoDatado, (error, resultado)=> {
                if(error){
                    res.status(400).json(error)
                } else{
                    const id = resultado.insertId
                    res.status(201).json({id, ...atendimento})
                }
            })
        }
    }

    lista(res){
        const sql = 'SELECT * FROM Atendimentos'

        connection.query(sql, (error, resultado) =>{
            if(error){
                res.status(400).json(error)
            }else{
                res.json(resultado)
            }
        })
    }

    buscaPorId(id, res){
        const sql = `SELECT * FROM Atendimentos WHERE id = ${id}`
        
        connection.query(sql, (error, resultado) =>{
            if(error){
                res.status(400).json(error)
            }else{
                const atendimento = resultado[0]
                res.status(200).json(atendimento)
            }
        })
    }

    altera(id, valores, res){
        if(valores.data){
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')
        }
        const sql = 'UPDATE Atendimentos SET ? WHERE id=?'
        connection.query(sql, [valores, id], (error, resultado) =>{
            if(error){
                res.status(400).json(error)
            }else{
                res.status(200).json({id, ...valores})
            }
        })
    }

    deleta(id, res){
        const sql = 'DELETE FROM Atendimentos WHERE id=?'
        connection.query(sql, id, (error, resultado) =>{
            if(error){
                res.status(400).json(error)
            }else{
                res.status(200).json({id})
            }
        })
    }
}

module.exports = new Atendimento
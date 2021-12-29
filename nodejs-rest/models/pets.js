const uploadDeArquivos = require('../infrastructure/arquivos/uploadDeArquivos')
const connection = require('../infrastructure/database/connections')

class Pet{
    adiciona(pet, res){
        const query = 'INSERT INTO Pets SET ?'

        uploadDeArquivos(pet.imagem, pet.nome, (erro, novoCaminho) => {
            if(erro){
                res.status(400).json({ erro })
            } else {

                const novoPet = {nome: pet.nome, imagem: novoCaminho}
                connection.query(query, novoPet, (erro) => {
                    if(erro){
                        console.log(erro)
                        res.status(400).json(erro)
                    } else{
                        res.status(200).json(novoPet)
                    }
                })
            }
        })
    }
}

module.exports = new Pet
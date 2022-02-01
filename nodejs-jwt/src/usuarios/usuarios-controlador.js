const Usuario = require('./usuarios-modelo');
const { NaoEncontrado, InvalidArgumentError } = require('../erros');

const tokens = require('./tokens')
const {EmailVerificacao, EmailRedefinicaoSenha} = require('./emails')
const { ConversorUsuario } = require('../conversores');
const { redefinicaoDeSenha } = require('./tokens');

function geraEndereco(rota, token){
  const baseURL = process.env.BASE_URL
  return `${baseURL}${rota}${token}`
}

module.exports = {
  async adiciona (req, res, proximo) {
    const { nome, email, senha, cargo } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email,
        emailVerificado: false,
        cargo
      });

      await usuario.adicionaSenha(senha)
      await usuario.adiciona();
      
      const token = tokens.verificacaoEmail.cria(usuario.id)
      const endereco = geraEndereco('/usuario/verifica_email/', token)
      const emailVerificacao = new EmailVerificacao(usuario, endereco)
      emailVerificacao.enviaEmail().catch(console.log)

      res.status(201).json();
    } catch (erro) {
      proximo(erro)
    }
  },

  async login(req, res, proximo) {
    try{
      const accessToken = tokens.access.cria(req.user.id)
      const refreshToken = await tokens.refresh.cria(req.user.id)
      res.set('Authorization', accessToken)
      res.status(200).json({ refreshToken })
    } catch(error) {
      proximo(error)
    }
  },

  async logout (req, res, proximo) {
    try{
      const token = req.token;
      await tokens.access.invalida(token)
      res.status(204).send()
    } catch(error){
      proximo(error)
    }
  },

  async lista (req, res, proximo) {
    try{
      const usuarios = await Usuario.lista();
      const conversor = new ConversorUsuario(
        'json',
        req.acesso.todos.permitido ? req.acesso.todos.atributos : req.acesso.apenasSeu.atributos
      )
      res.send(conversor.converter(usuarios));
    } catch(erro) {
      proximo(erro)
    }
  },

  async verificaEmail(req, res, proximo) {
    try {
      const usuario = req.user
      await usuario.verificaEmail()
      res.status(200).json()
    } catch (error) {
      proximo(error)
    }
  },

  async deleta (req, res, proximo) {
    try {
      const usuario = await Usuario.buscaPorId(req.params.id);
      await usuario.deleta();
      res.status(200).send();
    } catch (erro) {
      proximo(erro)
    }
  },
  
  async esqueciMinhaSenha (req, res, proximo) {
    const respostaPadrao = { mensagem: 'Se encontrarmos um usuário com este email, vamos enviar uma mensagem com as instruções para redefinir a senha.'}
    try{
      const email = req.body.email
      const usuario = await Usuario.buscaPorEmail(email)

      const token = await tokens.redefinicaoDeSenha.cria(usuario.id)

      const emailRedefinicaoSenha = new EmailRedefinicaoSenha(usuario, token)
      emailRedefinicaoSenha.enviaEmail()
      res.send(respostaPadrao)
    } catch(erro){
      if(erro instanceof NaoEncontrado){
        res.send(respostaPadrao)
        return
      }
      proximo()
    }
  },

  async trocarSenha(req, res, proximo){
    try{
      if(req.body.token === 'string' && req.body.token.length > 0) {
        throw new InvalidArgumentError('O token está invalido')
      }

      const id = await tokens.redefinicaoDeSenha.verifica(req.body.token)
      const usuario = await Usuario.buscaPorId(id)
      await usuario.adicionaSenha(req.body.senha)
      await usuario.atualizaSenha()
      redefinicaoDeSenha.invalida(req.body.token)
      res.send({ mensagem: 'Sua senha foi atualizada com sucesso!'})
    } catch (erro){
      proximo(erro)
    }
  }
};

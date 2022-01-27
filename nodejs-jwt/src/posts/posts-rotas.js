const postsControlador = require('./posts-controlador');
const { middlewaresAutenticacao } = require('../usuarios')
const autorizacao = require('../middlewares/autorizacao')

module.exports = app => {
  app
    .route('/post')
    .get([middlewaresAutenticacao.bearer, autorizacao(['admin', 'editor', 'assinante'])], postsControlador.lista)
    .post(
      [middlewaresAutenticacao.bearer, autorizacao(['admin', 'editor'])],
      postsControlador.adiciona);

  app
    .route('/post/:id')
    .delete(
      [middlewaresAutenticacao.bearer, autorizacao(['admin', 'editor'])],
      postsControlador.remover
    )
};

const posts = require('./src/posts');
const usuarios = require('./src/usuarios');

module.exports = app => {
  app.get('/', (req, res) => {res.send('Olá pessoal!')});
  
  posts.rotas(app);
  usuarios.rotas(app);
};
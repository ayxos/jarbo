module.exports = function (app, config, query) {
  app.get('/users', (req, res, next) => {
      query.getAll(res, 'User', 'users')
  })
}

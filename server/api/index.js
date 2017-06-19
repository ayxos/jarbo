import todos from './todos'
import users from './users'

module.exports = function (app, config, query) {
  users(app, config, query),
  todos(app, config, query)
}

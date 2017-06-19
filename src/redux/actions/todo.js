import {
  ALL_TODOS,
  REMOVE_TODO,
  CREATE_TODO
} from './actionTypes';
import helperQuery from './helper';

// Todos
function getTodos() {
  var url = '/tags';
  var type = ALL_TODOS;
  var response = 'tags';
  return helperQuery(url, type, response);
}

function createTodo(variables) {
  var url = '/tags';
  var type = CREATE_TODO;
  var response = 'tag';
  return helperQuery(url, type, response, variables);
}

function removeTodo(variables) {
  var url = '/tags/' + variables._id;
  var type = REMOVE_TODO;
  var response = 'tag';
  return helperQuery(url, type, response, variables, true);
}

module.exports = {
  getTodos,
  createTodo,
  removeTodo,
};

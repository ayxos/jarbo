import {
  ALL_USERS,
  EDIT_USER,
  CREATE_USER,
  SINGLE_USER,
  REMOVE_USER,
} from './actionTypes';
import helperQuery from './helper';

function getUsers() {
  var url = '/users';
  var type = ALL_USERS;
  var response = 'users';
  return helperQuery(url, type, response);
}

function getUser() {
  var url = '/me';
  var type = SINGLE_USER;
  var response = 'user';
  return { id: 1 };
}

function createUser(variables) {
  var url = '/api/todos/';
  var type = CREATE_USER;
  var response = 'user';
  return helperQuery(url, type, response, variables);
}

function updateUser(variables) {
  var url = '/api/todos/' + variables._id;
  var type = EDIT_USER;
  var response = 'user';
  return helperQuery(url, type, response, variables);
}

function removeUser(variables) {
  var url = '/api/todos/' + variables._id;
  var type = REMOVE_USER;
  var response = 'user';
  return helperQuery(url, type, response, variables, true);
}

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateUser,
  removeUser,
};

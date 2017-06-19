import { combineReducers } from 'redux'
import {routerReducer} from 'react-router-redux'
import ActionTypes from '../actions/actionTypes';
import customStateSwitcher from './helper';

var users = customStateSwitcher('users', ActionTypes.SINGLE_USER, ActionTypes.ALL_USERS, ActionTypes.CREATE_USER, ActionTypes.EDIT_USER, ActionTypes.REMOVE_USER);
var todos = customStateSwitcher('todos', ActionTypes.SINGLE_TODO, ActionTypes.ALL_TODOS, ActionTypes.CREATE_TODO, ActionTypes.EDIT_TODO, ActionTypes.REMOVE_TODO);

const rootReducer = combineReducers({
  users,
  todos,
  routing: routerReducer
})

export default rootReducer

import React from 'react'
import { Route, IndexRoute } from 'react-router'

import Main from './components/Main'
import HomePage from './components/HomePage'
import UserPage from './components/User/User'
import ItemPage from './components/Item/ItemPage'
import NotFoundPage from './components/NotFoundPage'

import LoginPage from './components/Login/Login'
import SignUpPage from './components/Login/Signup'

import Auth from './modules/Auth'

function checkAccount (nextState, replace, callback) {
  if (!Auth.isUserAuthenticated()) {
    replace('/')
  }
  callback()
}

function logout (nextState, replace, callback) {
  Auth.deauthenticateUser()
  // change the current URL to /
  replace('/')
  callback()
}

export default (
  <Route path='/' component={Main}>
    <IndexRoute component={HomePage} />
    <Route path='login' component={LoginPage} />
    <Route path='logout' component={HomePage} onEnter={logout} />
    <Route path='signup' component={SignUpPage} />
    <Route path='record' component={RecordPage} onEnter={checkAccount} />
    <Route path='/user/:id' component={UserPage} />
    <Route path='/item/:id' component={ItemPage} />
    <Route path='*' component={NotFoundPage} />
  </Route>
)

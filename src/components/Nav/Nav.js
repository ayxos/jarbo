import React from 'react'
import PropTypes from 'prop-types'
import { Link, IndexLink } from 'react-router'
import Auth from '../../modules/Auth'
import User from '../../constants'

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    }
  }
  
  componentDidMount() {
    if (Auth.isUserAuthenticated()) {
      var self = this;
      User.getBearer(Auth, function(info) {
        self.setState({user: info});
      })
    }
  };

  render () {
    return (
      <nav className={'navbar navbar-light bg-faded rounded navbar-toggleable-md'}>
        <button className={'navbar-toggler navbar-toggler-right'} type='button' data-toggle='collapse' data-target='#containerNavbar' aria-controls='containerNavbar' aria-expanded='false' aria-label='Toggle navigation'>
          <span className={'navbar-toggler-icon'} />
        </button>
        <IndexLink className={'navbar-brand'} to='/' style={{ fontFamily: 'Barrio' }}><img src='/resources/imgs/logo.png' width='32' />Doblame</IndexLink>
        <div className={'collapse navbar-collapse'} id='containerNavbar'>
          <ul className={'navbar-nav mr-auto'}>
            <li className={'nav-item active'}>
              <IndexLink className={'nav-link'} to='/'>Home</IndexLink>
            </li>
            {Auth.isUserAuthenticated() ? (
              <li className={'nav-item'}>
                <IndexLink className={'nav-link'} to='/record'>Record</IndexLink>
              </li>
            ) : null}
            {Auth.isUserAuthenticated() && this.state.user ? (
              <li className={'nav-item'}>
                <IndexLink className={'nav-link'} to={'/user/' + this.state.user.id}>{this.state.user.name}</IndexLink>
              </li>
            ) : null}
          </ul>
          {Auth.isUserAuthenticated() ? (
            <ul className={'navbar-nav navbar-right'}>
              <li className={'nav-item top-bar-right'}>
                <Link to='/logout' className={'nav-link'}>Log out</Link>
              </li>
            </ul>
          ) : (
            <ul className={'navbar-nav navbar-right'}>
              <li className={'nav-item top-bar-right'}>
                <Link to='/login' className={'nav-link'}>Log in</Link>
              </li>
              <li>
                <Link to='/signup' className={'nav-link'}>Sign up</Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
    )
  }
}

Header.propTypes = {
  children: PropTypes.element
}

export default Header
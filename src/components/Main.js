import React from 'react'
import PropTypes from 'prop-types'
import { Link, IndexLink } from 'react-router'
import GoogleAd from 'react-google-ads'
import Nav from './Nav/Nav'
import Footer from './Footer/Footer'

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.
class Main extends React.Component {

  render () {
    return (<div>
      <div className={'container'}>
        <Nav/>
        <div>
          <div className='container-field'>
            <div className='row'>
              <div className='ad col-md-12'> 
                <GoogleAd client="ca-pub-8070828061215574" slot="5762328040" format='auto'/>
              </div>
            </div>
            {this.props.children}
            <div className='row'>
              <div className='ad col-md-12'>
                <GoogleAd client="ca-pub-8070828061215574" slot="8576193646" format='auto'/>
              </div>
            </div>
          </div>
        </div>
        </div>
        <Footer/>
      </div>
    )
  }
}

Main.propTypes = {
  children: PropTypes.element
}

export default Main
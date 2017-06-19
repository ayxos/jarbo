import React from 'react'
import {Link} from 'react-router'
import '../../styles/about-page.css'

// Since this component is simple and static, there's no parent container for it.
const Footer = () => {
  return (
    <footer className='navbar navbar-fixed-bottom'>
      <p>
        This app has been created by <a href='http://ayxos.github.io/' target="_blank">ayxos</a>.
      </p>
    </footer>
  )
}

export default Footer

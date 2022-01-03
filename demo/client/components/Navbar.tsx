import React from 'react';
import { Link } from 'react-router-dom';
import './NavStyles.css';

function Navbar() {
  return (
    <nav className='Nav'>
      <Link to='/' className='nav-el' style={{ textDecoration: 'none' }}>
        EmberQL
      </Link>
      <Link to='/Demo' className='nav-el' style={{ textDecoration: 'none' }}>
        Demo
      </Link>
      <Link to='/Docs' className='nav-el' style={{ textDecoration: 'none' }}>
        Docs
      </Link>
      <Link to='/Team' className='nav-el' style={{ textDecoration: 'none' }}>
        The Team
      </Link>
    </nav>
  );
}

export default Navbar;

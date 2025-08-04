import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul style={{  listStyle: 'none', display: 'flex', gap: '20px', margin: 0, padding: 0 }}>
        <li><Link to="/" style={{textDecoration: 'none' }}>בית</Link></li>
        <li><Link to="/aboutUs" style={{textDecoration: 'none' }}>למה דווקא אנחנו?</Link></li>
        <li><Link to="/contact" style={{textDecoration: 'none' }}>צור קשר</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
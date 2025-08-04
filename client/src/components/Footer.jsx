// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/meged_shamaim_logo_TRANS.png';

function Footer() {
  return (
    <footer style={{
      
      
    }}>
     <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* תמונה ללא קישור, מיושרת למרכז */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <img
            src={logo}
            alt="לוגו מגד שמים"
            style={{ height: '120px', cursor: 'default' }}
          />
        </div>
  
  {/* טקסט זכויות */}
  <p style={{
    fontSize: '15px',
    margin: '10px 0 0 0',
    color: '#1a55a4',
    fontWeight: 'bold'
  }}>
    © {new Date().getFullYear()} מגד שמים - כל הזכויות שמורות
  </p>
</div>
    </footer>
  );
}

export default Footer;
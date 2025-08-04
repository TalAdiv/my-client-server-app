import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import logo from  '../assets/meged_shamaim_logo_TRANS.png'; // ודא שמייבא את הלוגו נכון

function Header() {
  return (
    <header>
      <div>
        <Link to="/">
          <img
            src={logo}
            alt="לוגו מגד שמים"
            style={{ height: '250px', cursor: 'pointer'}}
          />
        </Link>
      </div>
      <div id="div-nav">
        <Navbar />
      </div>
    </header>
  );
}

export default Header;
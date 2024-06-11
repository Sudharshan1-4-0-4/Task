import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FiLogOut } from 'react-icons/fi';
import { AiFillHome } from 'react-icons/ai';

import './ind.css';


const Header = () => {
  const navigate = useNavigate();

  const onClickLogout = () => {
    Cookies.remove('jwt_token');
    Cookies.remove("user_name");

    navigate('/login');
  };

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <div className="nav-bar-mobile-logo-container">
          <Link to="/">
            <h2 className='title'>Task..</h2>
          </Link>

          <ul className="nav-bar-mobile-icons-container">
            <li>
              <Link to="/">
                <AiFillHome className="nav-item-mobile-link" />
              </Link>
            </li>

            <li>
              <button
                type="button"
                className="nav-mobile-btn"
                onClick={onClickLogout}
              >
                <FiLogOut />
              </button>
            </li>
          </ul>
        </div>

        <div className="nav-bar-large-container">
          <Link to="/">
            <h2 className='title'>Task..</h2>
          </Link>
          <Link to="/" className="nav-link">
            Home
          </Link>
          <button
            type="button"
            className="logout-desktop-btn"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;

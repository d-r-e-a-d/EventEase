import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTicketAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };
  return <header className="site-nav"><nav className="nav-inner">
    <Link to="/" className="brand"><span className="brand-mark"><FaTicketAlt /></span>EventEase</Link>
    <div className="nav-links"><Link to="/" className="nav-link">Discover</Link>{user ? <><Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="nav-link">Dashboard</Link><button onClick={handleLogout} className="button button-quiet">Log out</button></> : <><Link to="/login" className="nav-link">Sign in</Link><Link to="/register" className="button button-primary">Get started</Link></>}</div>
  </nav></header>;
}

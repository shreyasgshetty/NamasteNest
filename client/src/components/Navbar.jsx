import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiPhone } from 'react-icons/fi';
import logoImg from '../assets/logo.png';
import './Navbar.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/rooms', label: 'Stays' },
  { to: '/location', label: 'Location' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const handleLogoClick = () => {
    if (pathname === '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    setOpen(false);
  };

  const handleLinkClick = (to) => {
    if (pathname === to) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    setOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo" onClick={handleLogoClick}>
          <img src={logoImg} alt="Namaste Nest Logo" className="navbar__logo-img" />
          <div>
            <span className="navbar__logo-name">Namaste Nest</span>
            <span className="navbar__logo-sub">Guest House · Mysuru</span>
          </div>
        </Link>

        <ul className={`navbar__links ${open ? 'navbar__links--open' : ''}`}>
          {links.map(l => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}
                onClick={() => handleLinkClick(l.to)}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
          <li>
            <a href="tel:+919108177979" className="navbar__call">
              <FiPhone size={14} /> Call Now
            </a>
          </li>
        </ul>

        <button className="navbar__hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>
    </nav>
  );
}

import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import logoImg from '../assets/logo.png';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top container">
        <div className="footer__brand">
          <div className="footer__logo">
            <img src={logoImg} alt="Namaste Nest Logo" className="footer__logo-img" />
            <span>Namaste Nest</span>
          </div>
          <p>Experience the warmth of Mysore hospitality. Your home away from home in the heart of the City of Palaces.</p>
          <div className="footer__socials">
            <a href="#" aria-label="Instagram"><FiInstagram /></a>
            <a href="#" aria-label="Facebook"><FiFacebook /></a>
            <a href="#" aria-label="Twitter"><FiTwitter /></a>
          </div>
        </div>

        <div className="footer__col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/rooms">Our Stays</Link></li>
            <li><Link to="/location">Location</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Room Types</h4>
          <ul>
            <li><Link to="/rooms">1 BHK</Link></li>
            <li><Link to="/rooms">2 BHK</Link></li>
            <li><Link to="/rooms">3 BHK</Link></li>
            <li><Link to="/rooms">4 BHK</Link></li>
            <li><Link to="/rooms">Studio Rooms</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Contact</h4>
          <div className="footer__contact-list">
            <a href="tel:+919108177979"><FiPhone /> +91 91081 77979</a>
            <a href="mailto:namastenestmysore@gmail.com"><FiMail /> namastenestmysore@gmail.com</a>
            <span><FiMapPin /> 959, 7th main, Gokulam 3rd Stage,<br />Mysore, Karnataka 570002</span>
          </div>
        </div>
      </div>

      <div className="footer__bottom container">
        <p>© {new Date().getFullYear()} Namaste Nest. All rights reserved.</p>
      </div>
    </footer>
  );
}

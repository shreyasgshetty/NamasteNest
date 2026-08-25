import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMapPin, FiPhone, FiWifi, FiStar, FiExternalLink } from 'react-icons/fi';
import { MdOutlineLocalParking, MdOutlineSecurity } from 'react-icons/md';
import { TbAirConditioning } from 'react-icons/tb';
import { SiGoogle, SiAirbnb } from 'react-icons/si';
import RoomCard from '../components/RoomCard';
import axios from 'axios';
import './Home.css';

const API = import.meta.env.VITE_API_URL;



export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    axios.get(`${API}/properties?featured=true`)
      .then(r => setFeatured(r.data.data || []))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero__overlay" />
        <div className="hero__content container">
          <span className="hero__eyebrow">🌸 Welcome to Mysore's Finest</span>
          <h1 className="hero__title">
            Your Home Away<br />From <span className="hero__title-gold">Home</span>
          </h1>
          <p className="hero__sub">
            Experience warm Kannadiga hospitality in the heart of the City of Palaces.
            Daily rental rooms crafted for comfort, culture, and connection.
          </p>
          <div className="hero__cta">
            <Link to="/rooms" className="btn-primary">Explore Rooms <FiArrowRight /></Link>
            <Link to="/contact" className="btn-outline">Contact Us</Link>
          </div>
          <div className="hero__location">
            <FiMapPin size={14} /> 959, 7th Main, Gokulam 3rd Stage, Mysore, Karnataka 570002
          </div>
        </div>
      </section>
    </div>
  );
}

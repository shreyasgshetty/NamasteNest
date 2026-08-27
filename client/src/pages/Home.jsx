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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/properties`)
      .then(r => {
        const all = r.data.data || [];
        const feat = all.filter(p => p.isFeatured);
        setFeatured(feat.length > 0 ? feat : all.slice(0, 3));
      })
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
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
            <FiMapPin size={14} /> 959, 7th Main, Gokulam 3rd Stage, Mysore, Karnataka 570020
          </div>
        </div>

        {/* HERO STATS */}
        <div className="hero__stats">
          <div className="hero__stat">
            <span className="hero__stat-val">5+</span>
            <span className="hero__stat-label">Room Types</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-val">100%</span>
            <span className="hero__stat-label">Verified Stays</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-val">24/7</span>
            <span className="hero__stat-label">Care & Support</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-val">Prime</span>
            <span className="hero__stat-label">Gokulam Location</span>
          </div>
        </div>
      </section>

      {/* FEATURED ROOMS */}
      <section className="section container">
        <p className="section-label">Our Accommodations</p>
        <h2 className="section-title">Featured Stays</h2>
        <p className="section-sub">Handpicked rooms designed for relaxation, work, and memorable stays.</p>

        {loading ? (
          <div className="home__rooms-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="home__rooms-grid">
            {featured.map(room => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <p>No rooms listed yet.</p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/rooms" className="btn-primary">
            View All Rooms <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section container" style={{ paddingTop: '20px' }}>
        <p className="section-label">Why Namaste Nest</p>
        <h2 className="section-title">Crafted for Peace of Mind</h2>
        <p className="section-sub">Experience the ideal blend of homely warmth and premium convenience.</p>

        <div className="home__why-grid">
          <div className="home__why-card">
            <div className="home__why-icon"><FiMapPin /></div>
            <h4>Prime Gokulam Location</h4>
            <p>Located in Mysore's vibrant Gokulam hub, minutes away from yoga centers, premier cafes, and palaces.</p>
          </div>
          <div className="home__why-card">
            <div className="home__why-icon"><FiWifi /></div>
            <h4>High-Speed WiFi & Work Desk</h4>
            <p>Seamless high-speed internet suited for digital nomads, remote work, and instant streaming.</p>
          </div>
          <div className="home__why-card">
            <div className="home__why-icon"><TbAirConditioning /></div>
            <h4>Modern Comforts</h4>
            <p>Spacious rooms with air conditioning, hot water, plush bedding, and hygienic private bathrooms.</p>
          </div>
          <div className="home__why-card">
            <div className="home__why-icon"><MdOutlineLocalParking /></div>
            <h4>Secure Parking</h4>
            <p>Safe on-premise parking spaces available for your four-wheelers and two-wheelers.</p>
          </div>
          <div className="home__why-card">
            <div className="home__why-icon"><MdOutlineSecurity /></div>
            <h4>24/7 Security & Care</h4>
            <p>Continuous security monitoring, power backup, and round-the-clock host assistance.</p>
          </div>
          <div className="home__why-card">
            <div className="home__why-icon"><FiPhone /></div>
            <h4>Direct Host Support</h4>
            <p>Zero middleman fees. Direct connection to your host for special requests and local tips.</p>
          </div>
        </div>
      </section>

      {/* REVIEWS & EXTERNAL LINKS */}
      <section className="section container" style={{ paddingTop: '20px' }}>
        <p className="section-label">Authentic Feedback</p>
        <h2 className="section-title">Verified Guest Reviews</h2>
        <p className="section-sub">We believe in complete transparency — see real reviews on trusted platforms.</p>

        <div className="home__review-cards">
          <a
            href="https://maps.app.goo.gl/Rk7bUzdaPRY5pz1q7"
            target="_blank"
            rel="noopener noreferrer"
            className="home__review-link home__review-link--google"
          >
            <div className="home__review-link-icon"><SiGoogle size={32} /></div>
            <div>
              <h3>Google Reviews</h3>
              <p>Explore real photos, location ratings, and verified reviews from our guests on Google Maps.</p>
              <span className="home__review-link-cta">View on Google Maps <FiExternalLink size={13} /></span>
            </div>
          </a>
          <a
            href="https://airbnb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="home__review-link home__review-link--airbnb"
          >
            <div className="home__review-link-icon"><SiAirbnb size={32} /></div>
            <div>
              <h3>Airbnb Reviews</h3>
              <p>Browse guest ratings, host badges, and verified stays on our Airbnb listing.</p>
              <span className="home__review-link-cta">View on Airbnb <FiExternalLink size={13} /></span>
            </div>
          </a>
        </div>
        <p className="home__review-note">🔒 We only display and link to real, external reviews.</p>
      </section>

      {/* CTA BANNER */}
      <section className="home__cta-banner">
        <div className="container home__cta-inner">
          <div>
            <h2>Planning Your Stay in Mysore?</h2>
            <p>Experience the finest hospitality at Namaste Nest. Book directly for the best rates.</p>
          </div>
          <div className="hero__cta" style={{ marginBottom: 0 }}>
            <Link to="/rooms" className="btn-primary">Browse All Rooms <FiArrowRight /></Link>
            <Link to="/contact" className="btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

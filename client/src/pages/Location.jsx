import { Link } from 'react-router-dom';
import { FiMapPin, FiNavigation, FiClock } from 'react-icons/fi';
import './Location.css';

const NEARBY = [
  { place: 'Mysore Palace', dist: '6 km', time: '15 min', icon: '🏰' },
  { place: 'Chamundi Hills', dist: '17 km', time: '30 min', icon: '⛰️' },
  { place: 'Devaraja Market', dist: '5 km', time: '10 min', icon: '🛍️' },
  { place: 'Mysore Zoo', dist: '7 km', time: '20 min', icon: '🦁' },
  { place: 'Brindavan Gardens', dist: '18 km', time: '30 min', icon: '🌿' },
  { place: 'St. Philomena\'s Church', dist: '5.5 km', time: '15 min', icon: '⛪' },
  { place: 'Mysore Railway Station', dist: '4 km', time: '10 min', icon: '🚂' },
  { place: 'Mysore Airport', dist: '15 km', time: '30 min', icon: '✈️' },
  { place: 'KSRTC Bus Stand', dist: '6 km', time: '15 min', icon: '🚌' },
];

export default function Location() {
  return (
    <div className="location">
      <div className="location__hero">
        <div className="location__hero-overlay" />
        <div className="container location__hero-content">
          <p className="section-label">Find Us</p>
          <h1 className="section-title">Our Location</h1>
          <div className="location__address">
            <FiMapPin /> 959, 7th main, Gokulam 3rd Stage,<br />Mysore, Karnataka 570002
          </div>
          <div style={{ marginTop: '18px' }}>
            <a
              href="https://maps.app.goo.gl/Rk7bUzdaPRY5pz1q7"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <FiNavigation size={15} /> Get Directions in Google Maps
            </a>
          </div>
        </div>
      </div>

      <div className="container location__body">
        {/* Map */}
        <div className="location__map-wrap">
          <iframe
            title="Namaste Nest Location - Mysore"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d600.2582578270255!2d76.62699596171352!3d12.33587359001278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf7a62f4fdae7d%3A0x5462a934a51ca1f3!2s959!5e0!3m2!1sen!2sin!4v1780754938682!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="location__map-pin">
            <FiMapPin />
            <div>
              <strong>Namaste Nest Guest House</strong>
              <span>959, 7th main, Gokulam 3rd Stage,<br />Mysore, Karnataka 570002</span>
            </div>
            <a
              href="https://maps.app.goo.gl/Rk7bUzdaPRY5pz1q7"
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent-hover)', fontWeight: 600, fontSize: '0.84rem' }}
            >
              <FiNavigation size={14} /> Open Maps
            </a>
          </div>
        </div>

        {/* Nearby Attractions */}
        <section className="location__section">
          <p className="section-label">Explore Mysore</p>
          <h2 className="section-title">Nearby Attractions</h2>
          <div className="gold-divider" />
          <div className="location__nearby-grid">
            {NEARBY.map(n => (
              <div key={n.place} className="location__nearby-card">
                <span className="location__nearby-icon">{n.icon}</span>
                <div className="location__nearby-info">
                  <strong>{n.place}</strong>
                  <div className="location__nearby-meta">
                    <span><FiMapPin size={11} /> {n.dist}</span>
                    <span><FiClock size={11} /> {n.time} to reach</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Plan Your Visit CTA */}
        <section style={{ margin: '40px 0 60px', textAlign: 'center' }}>
          <div style={{ padding: '48px 24px', background: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', maxWidth: '720px', margin: '0 auto' }}>
            <span className="section-label">PLAN YOUR STAY</span>
            <h2 className="section-title">Ready to Visit Mysuru?</h2>
            <div className="gold-divider" style={{ margin: '12px auto 16px' }} />
            <p className="section-sub" style={{ margin: '0 auto 28px', maxWidth: '520px' }}>
              Enjoy a peaceful and memorable stay at Namaste Nest in the heart of Gokulam.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/rooms" className="btn-primary">
                Explore Stays
              </Link>
              <Link to="/contact" className="btn-outline">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

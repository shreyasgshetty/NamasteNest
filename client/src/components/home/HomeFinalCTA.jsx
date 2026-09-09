import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import './HomeFinalCTA.css';

export default function HomeFinalCTA() {
  return (
    <section className="final-cta" aria-labelledby="cta-heading">
      <div className="final-cta__inner container">
        <div className="final-cta__text">
          <h2 id="cta-heading" className="final-cta__heading">
            Ready to explore Mysuru?
          </h2>
          <p className="final-cta__sub">
            Find a stay that works for your trip and get in touch directly when you're ready.
          </p>
        </div>
        <div className="final-cta__actions">
          <Link to="/rooms" className="btn-primary">
            Explore Stays <FiArrowRight size={15} aria-hidden="true" />
          </Link>
          <Link to="/contact" className="btn-outline">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}

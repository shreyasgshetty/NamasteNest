import { Link } from 'react-router-dom';
import { FiArrowRight, FiMapPin } from 'react-icons/fi';
import './HomeHero.css';

/*
 * HERO IMAGE — Mysuru Palace (warm daylight)
 * Unsplash page: https://unsplash.com/photos/brown-and-white-concrete-building-under-blue-sky-during-daytime-wUKv2IN5w2U
 * To get working CDN URL: open the link → right-click image → "Open image in new tab" → copy that URL.
 * Replace HERO_IMG below with that URL.
 */
const HERO_IMG = 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&fm=jpg&q=85&w=2400';

export default function HomeHero() {
  return (
    <section className="hero" aria-label="Namaste Nest — Stays in Gokulam, Mysuru">
      {/* Text panel — warm linen background */}
      <div className="hero__content">
        <span className="hero__pin">
          <FiMapPin size={13} aria-hidden="true" />
          Gokulam 3rd Stage · Mysuru, Karnataka
        </span>

        <h1 className="hero__title">
          Stay close to Mysuru.<br />
          Feel at home in Gokulam.
        </h1>

        <p className="hero__sub">
          Comfortable stays in one of Mysuru's familiar neighbourhoods — a convenient base for
          exploring the city, working remotely, visiting family or simply taking a few days away.
        </p>

        <div className="hero__cta">
          <Link to="/rooms" className="btn-primary">
            Explore Stays <FiArrowRight size={15} aria-hidden="true" />
          </Link>
          <Link to="/location" className="btn-outline">
            Get Directions
          </Link>
        </div>
      </div>

      {/* Image panel */}
      <div className="hero__visual">
        <img
          src={HERO_IMG}
          alt="Mysuru Palace — a heritage building under a clear blue sky surrounded by greenery"
          className="hero__photo"
          loading="eager"
          decoding="async"
          onError={(e) => { e.currentTarget.style.opacity = '0'; }}
        />
        {/* Subtle warm-left gradient for text bleed on intermediate widths */}
        <div className="hero__photo-shade" aria-hidden="true" />
      </div>
    </section>
  );
}

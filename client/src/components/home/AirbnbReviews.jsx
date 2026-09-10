import { FiExternalLink } from 'react-icons/fi';
import { SiAirbnb } from 'react-icons/si';
import './AirbnbReviews.css';

/*
 * Airbnb listing: https://www.airbnb.com.sg/rooms/1669361340542473773
 * Data sourced from live listing: 5.0 rating, 9 reviews, Guest favourite status.
 * No review text fabricated. Link opens the actual Airbnb listing.
 */
const AIRBNB_URL = 'https://www.airbnb.com.sg/rooms/1669361340542473773';

export default function AirbnbReviews() {
  return (
    <section className="airbnb-reviews" aria-labelledby="reviews-heading">
      <div className="airbnb-reviews__inner container">
        {/* Header */}
        <div className="airbnb-reviews__header">
          <span className="section-label">REAL GUEST EXPERIENCES</span>
          <h2 id="reviews-heading" className="airbnb-reviews__heading">
            What guests say.
          </h2>
          <div className="gold-divider" />
          <p className="airbnb-reviews__sub">
            See the stay through the words of guests who have been here.
          </p>
        </div>

        {/* Review block */}
        <div className="airbnb-reviews__block">
          {/* Airbnb badge */}
          <div className="airbnb-reviews__platform" aria-label="Airbnb">
            <SiAirbnb size={28} className="airbnb-reviews__platform-icon" aria-hidden="true" />
            <span className="airbnb-reviews__platform-name">Airbnb</span>
          </div>

          {/* Rating */}
          <div className="airbnb-reviews__rating" aria-label="5 out of 5 stars">
            <span className="airbnb-reviews__score">5.0</span>
            <div className="airbnb-reviews__stars" aria-hidden="true">
              {'★★★★★'.split('').map((s, i) => (
                <span key={i} className="airbnb-reviews__star">{s}</span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="airbnb-reviews__tags">
            <span className="airbnb-reviews__tag">12+ reviews</span>
            <span className="airbnb-reviews__tag airbnb-reviews__tag--highlight">
              Guest favourite
            </span>
          </div>

          {/* Note */}
          <p className="airbnb-reviews__note">
            Read the full guest reviews on Airbnb to see what guests have shared
            about their experience at Namaste Nest.
          </p>

          {/* CTA */}
          <a
            href={AIRBNB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="airbnb-reviews__cta"
            aria-label="View Namaste Nest on Airbnb (opens in new tab)"
          >
            View on Airbnb
            <FiExternalLink size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

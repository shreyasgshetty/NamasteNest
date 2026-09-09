import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import RoomCard from '../RoomCard';
import './FeaturedStays.css';

export default function FeaturedStays({ rooms, loading }) {
  return (
    <section className="featured-stays" aria-labelledby="stays-heading">
      <div className="container">
        {/* Header */}
        <div className="featured-stays__header">
          <div>
            <span className="section-label">STAY YOUR WAY</span>
            <h2 id="stays-heading" className="featured-stays__heading">
              Find your stay.
            </h2>
            <div className="gold-divider" />
            <p className="featured-stays__sub">
              Choose a space that fits your trip, from compact stays to larger homes
              for families and groups.
            </p>
          </div>
          <Link to="/rooms" className="featured-stays__view-all btn-outline" aria-label="View all stays">
            View all stays <FiArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="featured-stays__grid" aria-busy="true" aria-label="Loading stays">
            {[1, 2, 3].map((i) => (
              <div key={i} className="stay-skeleton" aria-hidden="true" />
            ))}
          </div>
        ) : rooms.length > 0 ? (
          <div className="featured-stays__grid">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        ) : (
          <div className="featured-stays__empty">
            <p>No stays listed yet. Check back soon.</p>
          </div>
        )}

        {/* Mobile-only bottom CTA */}
        <div className="featured-stays__mobile-cta">
          <Link to="/rooms" className="btn-primary">
            View all stays <FiArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

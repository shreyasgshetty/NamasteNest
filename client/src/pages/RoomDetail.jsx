import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiUsers, FiMaximize, FiCheck, FiPhone, FiMapPin, FiExternalLink, FiStar, FiDroplet, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { MdOutlineKingBed } from 'react-icons/md';
import { SiGoogle, SiAirbnb } from 'react-icons/si';
import axios from 'axios';
import { resolveImages } from '../utils/imageUrl';
import './RoomDetail.css';

const API = import.meta.env.VITE_API_URL;

export default function RoomDetail() {
  const { slug } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false); // lightbox open state

  useEffect(() => {
    axios.get(`${API}/properties/${slug}`)
      .then(r => setRoom(r.data.data))
      .catch(() => setRoom(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const images = room?.images?.length
    ? resolveImages(room.images)
    : ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=85'];

  // Navigation helpers
  const prev = useCallback(() =>
    setActiveImg(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() =>
    setActiveImg(i => (i + 1) % images.length), [images.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape')     setLightbox(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, prev, next]);

  // Lock body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  if (loading) return <div className="rd-loading"><div className="rd-spinner" /></div>;
  if (!room) return (
    <div className="rd-notfound container">
      <h2>Property not found</h2>
      <Link to="/rooms" className="btn-primary">Back to Rooms</Link>
    </div>
  );

  const loc = room.location || {};
  const rev = room.reviews || {};

  return (
    <div className="rd">
      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div className="rd__lightbox" onClick={() => setLightbox(false)}>
          <button className="rd__lb-close" onClick={() => setLightbox(false)} aria-label="Close">
            <FiX size={24} />
          </button>

          {images.length > 1 && (
            <button className="rd__lb-nav rd__lb-nav--left" onClick={e => { e.stopPropagation(); prev(); }} aria-label="Previous">
              <FiChevronLeft size={32} />
            </button>
          )}

          <div className="rd__lb-frame" onClick={e => e.stopPropagation()}>
            <img src={images[activeImg]} alt={room.name} className="rd__lb-img" />
            {images.length > 1 && (
              <div className="rd__lb-counter">{activeImg + 1} / {images.length}</div>
            )}
          </div>

          {images.length > 1 && (
            <button className="rd__lb-nav rd__lb-nav--right" onClick={e => { e.stopPropagation(); next(); }} aria-label="Next">
              <FiChevronRight size={32} />
            </button>
          )}
        </div>
      )}

      {/* Hero */}
      <div className="rd__hero" style={{ backgroundImage: `url(${images[0]})` }}>
        <div className="rd__hero-overlay" />
        <div className="container rd__hero-content">
          <Link to="/rooms" className="rd__back"><FiArrowLeft /> All Rooms</Link>
          <span className="rd__type-badge">{room.type}</span>
          <h1>{room.name}</h1>
          {loc.address && (
            <p className="rd__hero-addr"><FiMapPin size={13} /> {loc.address}{loc.city ? `, ${loc.city}` : ''}</p>
          )}
        </div>
      </div>

      <div className="container rd__body">
        <div className="rd__left">
          {/* Gallery */}
          <div className="rd__gallery">
            {/* Main image — click opens lightbox */}
            <div className="rd__main-wrap">
              <img
                src={images[activeImg]}
                alt={room.name}
                className="rd__main-img"
                onClick={() => setLightbox(true)}
                title="Click to view full size"
              />
              {/* Chevron buttons on main image */}
              {images.length > 1 && (
                <>
                  <button className="rd__img-nav rd__img-nav--left" onClick={prev} aria-label="Previous photo">
                    <FiChevronLeft size={20} />
                  </button>
                  <button className="rd__img-nav rd__img-nav--right" onClick={next} aria-label="Next photo">
                    <FiChevronRight size={20} />
                  </button>
                </>
              )}
              <div className="rd__img-hint">🔍 Click to view full size</div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="rd__thumbs">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`rd__thumb-wrap ${i === activeImg ? 'rd__thumb-wrap--active' : ''}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt={`Photo ${i + 1}`} className="rd__thumb" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* About */}
          <div className="rd__section">
            <h2>About This Property</h2>
            <div className="gold-divider" />
            <div className="rd__meta-row">
              <span><FiUsers size={14} /> Up to {room.capacity} guests</span>
              {room.bedrooms >= 1 && <span><MdOutlineKingBed size={14} /> {room.bedrooms} bedroom{room.bedrooms > 1 ? 's' : ''}</span>}
              <span><FiDroplet size={14} /> {room.bathrooms} bathroom{room.bathrooms > 1 ? 's' : ''}</span>
              {room.size && <span><FiMaximize size={14} /> {room.size}</span>}
              {room.floor && <span>Floor {room.floor}</span>}
            </div>
            <p className="rd__desc">{room.description}</p>
          </div>

          {/* Highlights */}
          {room.highlights?.length > 0 && (
            <div className="rd__section">
              <h2>Highlights</h2>
              <div className="gold-divider" />
              <div className="rd__highlights">
                {room.highlights.map(h => (
                  <div key={h} className="rd__highlight"><FiCheck className="rd__check" /> {h}</div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {room.amenities?.length > 0 && (
            <div className="rd__section">
              <h2>Amenities & Facilities</h2>
              <div className="gold-divider" />
              <div className="rd__amenities">
                {room.amenities.map(a => (
                  <span key={a}><FiCheck size={11} className="rd__check" /> {a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Location Map */}
          {(loc.googleMapsUrl || loc.address) && (
            <div className="rd__section">
              <h2>Location</h2>
              <div className="gold-divider" />
              <div className="rd__loc-info">
                {loc.address && <p className="rd__loc-addr"><FiMapPin /> {loc.address}{loc.landmark ? ` · Near ${loc.landmark}` : ''}, {loc.city} {loc.pincode}</p>}
                {loc.googleMapsLink && (
                  <a href={loc.googleMapsLink} target="_blank" rel="noopener noreferrer" className="rd__maps-link">
                    <FiExternalLink /> Open in Google Maps
                  </a>
                )}
              </div>
              {loc.googleMapsUrl && (
                <div className="rd__map-embed">
                  <iframe src={loc.googleMapsUrl} title="Property Location" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              )}
            </div>
          )}

          {/* Real Reviews */}
          {(rev.googleBusinessUrl || rev.airbnbUrl) && (
            <div className="rd__section">
              <h2>Guest Reviews</h2>
              <div className="gold-divider" />
              <p className="rd__reviews-note">
                We believe in transparency — read real, verified reviews from guests on Google and Airbnb.
              </p>
              <div className="rd__review-links">
                {rev.googleBusinessUrl && (
                  <a href={rev.googleBusinessUrl} target="_blank" rel="noopener noreferrer" className="rd__review-card rd__review-card--google">
                    <div className="rd__review-card-logo"><SiGoogle size={22} /></div>
                    <div className="rd__review-card-body">
                      <strong>Google Reviews</strong>
                      {rev.googleRating && (
                        <div className="rd__review-stars">
                          <span className="rd__rating-val">{rev.googleRating}</span>
                          <span className="rd__stars">{Array.from({ length: 5 }, (_, i) => (
                            <FiStar key={i} size={12} fill={i < Math.round(rev.googleRating) ? '#fbbc04' : 'none'} color={i < Math.round(rev.googleRating) ? '#fbbc04' : '#666'} />
                          ))}</span>
                          {rev.googleReviewCount && <span className="rd__rev-count">({rev.googleReviewCount} reviews)</span>}
                        </div>
                      )}
                      <span className="rd__review-cta">Read on Google <FiExternalLink size={12} /></span>
                    </div>
                  </a>
                )}
                {rev.airbnbUrl && (
                  <a href={rev.airbnbUrl} target="_blank" rel="noopener noreferrer" className="rd__review-card rd__review-card--airbnb">
                    <div className="rd__review-card-logo"><SiAirbnb size={24} /></div>
                    <div className="rd__review-card-body">
                      <strong>Airbnb Reviews</strong>
                      <p>See what Airbnb guests say about this property</p>
                      <span className="rd__review-cta">Read on Airbnb <FiExternalLink size={12} /></span>
                    </div>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="rd__sidebar">
          <div className="rd__price-card">
            <div className="rd__price">
              <span className="rd__price-val">₹{room.price?.toLocaleString()}</span>
              <span className="rd__price-unit">/ night</span>
            </div>
            {rev.googleRating && (
              <div className="rd__sidebar-rating">
                <FiStar fill="#fbbc04" color="#fbbc04" size={14} />
                <strong>{rev.googleRating}</strong>
                {rev.googleReviewCount && <span>({rev.googleReviewCount} reviews)</span>}
              </div>
            )}
            <a href="tel:+919876543210" className="btn-primary rd__cta-btn">
              <FiPhone /> Call to Enquire
            </a>
            <Link to="/contact" className="btn-outline rd__cta-btn">
              Send Enquiry
            </Link>
            <p className="rd__note">📞 Call or message us directly — our team will assist you right away.</p>
          </div>

          <div className="rd__avail-badge">
            <span className={`rd__avail-dot ${room.isAvailable ? 'green' : 'red'}`} />
            {room.isAvailable ? 'Available for Stay' : 'Currently Unavailable'}
          </div>

          {loc.address && (
            <div className="rd__sidebar-loc">
              <FiMapPin size={13} color="var(--primary)" />
              <span>{loc.address}{loc.city ? `, ${loc.city}` : ''}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

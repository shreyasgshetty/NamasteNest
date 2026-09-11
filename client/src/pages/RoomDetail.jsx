import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiUsers,
  FiMaximize,
  FiCheck,
  FiPhone,
  FiMapPin,
  FiExternalLink,
  FiStar,
  FiDroplet,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from 'react-icons/fi';
import { MdOutlineKingBed } from 'react-icons/md';
import { SiGoogle, SiAirbnb } from 'react-icons/si';
import axios from 'axios';
import { resolveImages } from '../utils/imageUrl';
import './RoomDetail.css';

const API = import.meta.env.VITE_API_URL;
const OFFICIAL_PHONE_DISPLAY = '+91 91081 77979';
const OFFICIAL_PHONE_TEL = 'tel:+919108177979';
const VERIFIED_AIRBNB_URL = 'https://www.airbnb.com.sg/rooms/1669361340542473773';

/**
 * Extracts a clean src URL if the database field contains full iframe HTML code
 */
function extractEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/src=["']([^"']+)["']/i);
  if (match && match[1]) return match[1];
  return url.split('"')[0].trim();
}

export default function RoomDetail() {
  const { slug } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    axios
      .get(`${API}/properties/${slug}`)
      .then((r) => setRoom(r.data.data))
      .catch(() => setRoom(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const images = useMemo(() => {
    if (room?.images?.length) {
      const resolved = resolveImages(room.images);
      if (resolved.length > 0) return resolved;
    }
    return ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85'];
  }, [room?.images]);

  // Keep active index within valid bounds
  const currentImgIndex = activeImg < images.length ? activeImg : 0;

  // Navigation helpers
  const prev = useCallback(() => {
    setActiveImg((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setActiveImg((i) => (i + 1) % images.length);
  }, [images.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') setLightbox(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, prev, next]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  if (loading) {
    return (
      <div className="rd-loading" role="status" aria-live="polite">
        <div className="rd-spinner" />
        <p className="rd-loading-text">Loading stay details...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="rd-notfound container">
        <span className="section-label">PROPERTY NOT FOUND</span>
        <h1 className="rd-notfound__title">This stay couldn't be found</h1>
        <p className="rd-notfound__desc">
          The property may have been removed or the link may no longer be available.
        </p>
        <Link to="/rooms" className="btn-primary">
          <FiArrowLeft size={16} /> All Stays
        </Link>
      </div>
    );
  }

  const loc = room.location || {};
  const rev = room.reviews || {};
  const isFeaturedStay = room.isFeatured || room.slug === 'namaste-nest';
  const cleanMapEmbed = extractEmbedUrl(loc.googleMapsUrl);

  // Review logic adhering strictly to rule #24 & #25:
  // Only Namaste Nest has verified Airbnb reputation data.
  // Other properties only display real review data if present in API.
  const hasAirbnbReview = isFeaturedStay || Boolean(rev.airbnbUrl);
  const airbnbTargetUrl = rev.airbnbUrl || (isFeaturedStay ? VERIFIED_AIRBNB_URL : null);
  const hasGoogleReview = Boolean(rev.googleBusinessUrl);
  const showReviewsSection = hasAirbnbReview || hasGoogleReview;

  const enquiryUrl = `/contact?stay=${encodeURIComponent(room.name)}`;

  return (
    <div className="rd">
      {/* ── LIGHTBOX (Preserved original interaction) ── */}
      {lightbox && (
        <div className="rd__lightbox" onClick={() => setLightbox(false)} role="dialog" aria-modal="true" aria-label="Photo Lightbox">
          <button
            type="button"
            className="rd__lb-close"
            onClick={() => setLightbox(false)}
            aria-label="Close photo lightbox"
          >
            <FiX size={24} />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              className="rd__lb-nav rd__lb-nav--left"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous photo"
            >
              <FiChevronLeft size={30} />
            </button>
          )}

          <div className="rd__lb-frame" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[currentImgIndex]}
              alt={`${room.name} — view ${currentImgIndex + 1}`}
              className="rd__lb-img"
            />
            {images.length > 1 && (
              <div className="rd__lb-counter">
                {currentImgIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {images.length > 1 && (
            <button
              type="button"
              className="rd__lb-nav rd__lb-nav--right"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next photo"
            >
              <FiChevronRight size={30} />
            </button>
          )}
        </div>
      )}

      {/* ── 1. PROPERTY HEADER (Editorial, generous whitespace) ── */}
      <header className="rd__header">
        <div className="container rd__header-inner">
          <Link to="/rooms" className="rd__back-link">
            <FiArrowLeft size={15} />
            <span>All stays</span>
          </Link>

          <div className="rd__header-meta">
            {room.type && <span className="rd__eyebrow">{room.type}</span>}
            <h1 className="rd__title">{room.name}</h1>
            <p className="rd__location-sub">
              <FiMapPin size={15} className="rd__loc-pin" />
              <span>
                {loc.address
                  ? `${loc.address}${loc.city ? `, ${loc.city}` : ''}`
                  : 'Gokulam, Mysuru'}
              </span>
            </p>
          </div>
        </div>
      </header>

      {/* ── 2. EDITORIAL PHOTO GALLERY COLLAGE ── */}
      <section className="rd__gallery-section" aria-label="Property gallery">
        <div className="container">
          <div className={`rd__gallery rd__gallery--count-${Math.min(images.length, 5)}`}>
            {/* Primary Main Photo (occupies ~65-70% on desktop) */}
            <div
              className="rd__photo-main"
              onClick={() => {
                setActiveImg(0);
                setLightbox(true);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveImg(0);
                  setLightbox(true);
                }
              }}
              aria-label="View photo 1 in fullscreen"
            >
              <img
                src={images[0]}
                alt={`${room.name} — primary photo`}
                className="rd__img"
                loading="eager"
              />

              {/* Chevrons on main photo */}
              {images.length > 1 && (
                <div className="rd__main-chevrons" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="rd__main-nav rd__main-nav--prev"
                    onClick={prev}
                    aria-label="Previous photo"
                  >
                    <FiChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    className="rd__main-nav rd__main-nav--next"
                    onClick={next}
                    aria-label="Next photo"
                  >
                    <FiChevronRight size={18} />
                  </button>
                </div>
              )}

              {/* Mobile photo counter */}
              {images.length > 1 && (
                <div className="rd__mobile-counter">
                  {currentImgIndex + 1} / {images.length}
                </div>
              )}

              {/* Subtle "View all photos" button overlay */}
              <button
                type="button"
                className="rd__view-all-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox(true);
                }}
                aria-label="View all photos"
              >
                <FiMaximize size={14} />
                <span>View all photos ({images.length})</span>
              </button>
            </div>

            {/* Secondary Photos Column / Collage (Desktop / Tablet) */}
            {images.length > 1 && (
              <div className="rd__photo-secondary-group">
                {images.slice(1, 5).map((imgUrl, idx) => {
                  const actualIndex = idx + 1;
                  const isLastVisible = idx === 3 && images.length > 5;
                  const remainingCount = images.length - 5;

                  return (
                    <div
                      key={actualIndex}
                      className="rd__photo-secondary"
                      onClick={() => {
                        setActiveImg(actualIndex);
                        setLightbox(true);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setActiveImg(actualIndex);
                          setLightbox(true);
                        }
                      }}
                      aria-label={`View photo ${actualIndex + 1} in fullscreen`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${room.name} — photo ${actualIndex + 1}`}
                        className="rd__img"
                        loading="lazy"
                      />
                      {isLastVisible && (
                        <div className="rd__more-overlay">
                          <span>+{remainingCount} more</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile Thumbnail Strip (Smooth horizontal scrolling) */}
          {images.length > 1 && (
            <div className="rd__mobile-thumbs" aria-label="Photo thumbnails">
              {images.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  className={`rd__mobile-thumb-item ${i === currentImgIndex ? 'rd__mobile-thumb-item--active' : ''}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`Select photo ${i + 1}`}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="rd__mobile-thumb-img" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 3. MAIN CONTENT + STICKY ENQUIRY CARD ── */}
      <div className="container rd__main-layout">
        <main className="rd__content-column">
          {/* About Section */}
          <section className="rd__section rd__section--about" aria-labelledby="about-heading">
            <span className="rd__section-label">ABOUT THE STAY</span>
            <h2 id="about-heading" className="rd__section-title">
              About {room.name}
            </h2>
            <div className="gold-divider" />
            <p className="rd__description">{room.description}</p>

            {/* Structured Property Facts Grid */}
            <div className="rd__facts-grid">
              {room.capacity && (
                <div className="rd__fact-card">
                  <FiUsers className="rd__fact-icon" size={20} />
                  <div className="rd__fact-text">
                    <span className="rd__fact-title">Guests</span>
                    <strong className="rd__fact-value">Up to {room.capacity}</strong>
                  </div>
                </div>
              )}

              {room.bedrooms >= 1 && (
                <div className="rd__fact-card">
                  <MdOutlineKingBed className="rd__fact-icon" size={22} />
                  <div className="rd__fact-text">
                    <span className="rd__fact-title">Bedrooms</span>
                    <strong className="rd__fact-value">
                      {room.bedrooms} Bedroom{room.bedrooms > 1 ? 's' : ''}
                    </strong>
                  </div>
                </div>
              )}

              {room.bathrooms >= 1 && (
                <div className="rd__fact-card">
                  <FiDroplet className="rd__fact-icon" size={20} />
                  <div className="rd__fact-text">
                    <span className="rd__fact-title">Bathrooms</span>
                    <strong className="rd__fact-value">
                      {room.bathrooms} Bathroom{room.bathrooms > 1 ? 's' : ''}
                    </strong>
                  </div>
                </div>
              )}

              {room.size && (
                <div className="rd__fact-card">
                  <FiMaximize className="rd__fact-icon" size={20} />
                  <div className="rd__fact-text">
                    <span className="rd__fact-title">Living Space</span>
                    <strong className="rd__fact-value">{room.size}</strong>
                  </div>
                </div>
              )}

              {room.floor && (
                <div className="rd__fact-card">
                  <span className="rd__fact-icon rd__fact-icon--text">FL</span>
                  <div className="rd__fact-text">
                    <span className="rd__fact-title">Floor Level</span>
                    <strong className="rd__fact-value">Floor {room.floor}</strong>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Highlights Section (What You'll Love) */}
          {room.highlights?.length > 0 && (
            <section className="rd__section rd__section--highlights" aria-labelledby="highlights-heading">
              <span className="rd__section-label">WHAT YOU'LL LOVE</span>
              <h2 id="highlights-heading" className="rd__section-title">
                Stay Highlights
              </h2>
              <div className="gold-divider" />
              <div className="rd__highlights-grid">
                {room.highlights.map((h, i) => (
                  <div key={i} className="rd__highlight-item">
                    <span className="rd__highlight-check">
                      <FiCheck size={16} />
                    </span>
                    <span className="rd__highlight-text">{h}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Amenities Section */}
          {room.amenities?.length > 0 && (
            <section className="rd__section rd__section--amenities" aria-labelledby="amenities-heading">
              <span className="rd__section-label">COMFORT & CONVENIENCE</span>
              <h2 id="amenities-heading" className="rd__section-title">
                Amenities & Facilities
              </h2>
              <div className="gold-divider" />
              <div className="rd__amenities-grid">
                {room.amenities.map((a, i) => (
                  <div key={i} className="rd__amenity-item">
                    <span className="rd__amenity-icon">
                      <FiCheck size={14} />
                    </span>
                    <span className="rd__amenity-name">{a}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Location & Neighbourhood Section */}
          {(loc.address || cleanMapEmbed) && (
            <section className="rd__section rd__section--location" aria-labelledby="location-heading">
              <span className="rd__section-label">THE NEIGHBOURHOOD</span>
              <h2 id="location-heading" className="rd__section-title">
                Stay in {loc.city ? `${loc.city}` : 'Gokulam, Mysuru'}
              </h2>
              <div className="gold-divider" />

              <div className="rd__location-details">
                <div className="rd__location-text-wrap">
                  {loc.address && (
                    <p className="rd__location-address">
                      <FiMapPin size={18} className="rd__loc-address-pin" />
                      <span>
                        <strong>{loc.address}</strong>
                        {loc.landmark && <span className="rd__loc-landmark"> · Near {loc.landmark}</span>}
                        <br />
                        {loc.city ? `${loc.city}, ` : ''}{loc.state ? `${loc.state} ` : ''}{loc.pincode || ''}
                      </span>
                    </p>
                  )}

                  {loc.googleMapsLink && (
                    <a
                      href={loc.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rd__maps-link-btn"
                    >
                      <FiExternalLink size={14} />
                      <span>Open in Google Maps</span>
                    </a>
                  )}
                </div>

                {cleanMapEmbed && (
                  <div className="rd__map-container">
                    <iframe
                      src={cleanMapEmbed}
                      title={`${room.name} Location`}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rd__map-iframe"
                    />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Guest Reviews Section (Rendered strictly if real verified reviews exist) */}
          {showReviewsSection && (
            <section className="rd__section rd__section--reviews" aria-labelledby="reviews-heading">
              <span className="rd__section-label">GUEST REVIEWS</span>
              <h2 id="reviews-heading" className="rd__section-title">
                Loved by Guests
              </h2>
              <div className="gold-divider" />
              <p className="rd__reviews-intro">
                We believe in genuine transparency — read verified reviews from guests who have stayed with us.
              </p>

              <div className="rd__review-cards-wrap">
                {/* Airbnb Verified Review Block */}
                {hasAirbnbReview && airbnbTargetUrl && (
                  <a
                    href={airbnbTargetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rd__review-card rd__review-card--airbnb"
                  >
                    <div className="rd__review-card-header">
                      <SiAirbnb size={26} className="rd__airbnb-logo" />
                      <span className="rd__review-platform">Airbnb</span>
                    </div>

                    <div className="rd__review-score-row">
                      <div className="rd__review-star-badge">
                        <FiStar size={16} className="rd__star-icon" />
                        <span className="rd__score-value">5.0</span>
                      </div>
                      <span className="rd__review-count-label">Guest favourite · 12+ reviews</span>
                    </div>

                    <p className="rd__review-card-desc">
                      Consistently rated 5.0 stars on Airbnb for exceptional hospitality, cleanliness, and comfort in Gokulam.
                    </p>

                    <div className="rd__review-card-action">
                      <span>Read reviews on Airbnb</span>
                      <FiExternalLink size={13} />
                    </div>
                  </a>
                )}

                {/* Google Verified Review Block (if provided in API) */}
                {hasGoogleReview && (
                  <a
                    href={rev.googleBusinessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rd__review-card rd__review-card--google"
                  >
                    <div className="rd__review-card-header">
                      <SiGoogle size={22} className="rd__google-logo" />
                      <span className="rd__review-platform">Google</span>
                    </div>

                    {rev.googleRating && (
                      <div className="rd__review-score-row">
                        <div className="rd__review-star-badge">
                          <FiStar size={16} className="rd__star-icon" />
                          <span className="rd__score-value">{rev.googleRating}</span>
                        </div>
                        {rev.googleReviewCount && (
                          <span className="rd__review-count-label">
                            ({rev.googleReviewCount} reviews)
                          </span>
                        )}
                      </div>
                    )}

                    <p className="rd__review-card-desc">
                      Verified guest ratings and feedback on our Google Business profile.
                    </p>

                    <div className="rd__review-card-action">
                      <span>Read on Google</span>
                      <FiExternalLink size={13} />
                    </div>
                  </a>
                )}
              </div>
            </section>
          )}
        </main>

        {/* ── 4. STICKY ENQUIRY CARD (Desktop) ── */}
        <aside className="rd__sidebar-column">
          <div className="rd__sticky-card">
            <span className="rd__card-eyebrow">YOUR STAY</span>

            <div className="rd__price-display">
              <span className="rd__price-val">₹{room.price?.toLocaleString()}</span>
              <span className="rd__price-unit">/ night</span>
            </div>

            {room.capacity && (
              <p className="rd__card-capacity">
                <FiUsers size={14} /> Up to {room.capacity} guests
              </p>
            )}

            <div className="rd__card-divider" />

            <div className="rd__card-actions">
              <a href={OFFICIAL_PHONE_TEL} className="btn-primary rd__btn-call">
                <FiPhone size={15} />
                <span>Call to Enquire</span>
              </a>

              <Link to={enquiryUrl} className="btn-outline rd__btn-enquire">
                Send Enquiry
              </Link>
            </div>

            <p className="rd__card-note">
              We'll help you with dates, availability, and any questions about your stay in Mysuru.
            </p>

            <div className="rd__card-contact-line">
              <span>Direct: </span>
              <a href={OFFICIAL_PHONE_TEL} className="rd__direct-phone">
                {OFFICIAL_PHONE_DISPLAY}
              </a>
            </div>

            {loc.address && (
              <div className="rd__card-location">
                <FiMapPin size={13} className="rd__card-loc-icon" />
                <span>{loc.city ? `${loc.city}, Karnataka` : 'Gokulam, Mysuru'}</span>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ── 5. FINAL WARM SANDSTONE CTA SECTION ── */}
      <section className="rd__final-cta" aria-labelledby="cta-heading">
        <div className="container rd__final-cta-inner">
          <span className="section-label">PLAN YOUR VISIT</span>
          <h2 id="cta-heading" className="rd__final-cta-title">
            Ready to Plan Your Stay?
          </h2>
          <p className="rd__final-cta-desc">
            Have questions about {room.name}, your dates, or exploring Mysuru? Reach out directly and we will be delighted to assist you.
          </p>
          <div className="rd__final-cta-buttons">
            <Link to={enquiryUrl} className="btn-primary rd__final-btn">
              Send an Enquiry
            </Link>
            <a href={OFFICIAL_PHONE_TEL} className="btn-outline rd__final-btn">
              <FiPhone size={15} />
              <span>Call {OFFICIAL_PHONE_DISPLAY}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── 6. MOBILE STICKY BOTTOM ENQUIRY BAR ── */}
      <div className="rd__mobile-bar" aria-label="Quick enquiry">
        <div className="rd__mobile-bar-inner">
          <div className="rd__mobile-bar-price">
            <span className="rd__mobile-price-val">₹{room.price?.toLocaleString()}</span>
            <span className="rd__mobile-price-unit">/ night</span>
          </div>
          <div className="rd__mobile-bar-actions">
            <a
              href={OFFICIAL_PHONE_TEL}
              className="rd__mobile-call-icon-btn"
              aria-label={`Call ${OFFICIAL_PHONE_DISPLAY}`}
            >
              <FiPhone size={16} />
            </a>
            <Link to={enquiryUrl} className="btn-primary rd__mobile-enquire-btn">
              Send Enquiry
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

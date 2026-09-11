import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FiSearch, FiArrowRight, FiUsers, FiExternalLink,
  FiRefreshCw, FiDroplet,
} from 'react-icons/fi';
import { MdOutlineKingBed } from 'react-icons/md';
import { SiAirbnb } from 'react-icons/si';
import RoomCard from '../components/RoomCard';
import { resolveImageUrl } from '../utils/imageUrl';
import axios from 'axios';
import './Rooms.css';

const API = import.meta.env.VITE_API_URL;

/* Filter types — value matches DB, label is display name */
const TYPES = [
  { value: 'All', label: 'All' },
  { value: 'Studio', label: 'Studio' },
  { value: '1BHK', label: '1 BHK' },
  { value: '2BHK', label: '2 BHK' },
  { value: '3BHK', label: '3 BHK' },
  { value: '4BHK', label: '4 BHK' },
];

/* Verified Namaste Nest Airbnb listing */
const AIRBNB_URL = 'https://www.airbnb.com.sg/rooms/1669361340542473773';

/* Verified Mysuru Palace editorial banner image */
const BANNER_IMG =
  'https://www.naturetravelagency.com/uploads/1757066809Mysore%20Ooty%20Coorg%20tour%20package.png?auto=format&fit=crop&fm=jpg&q=85&w=2400';

const FALLBACK_IMAGES = {
  'Studio': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85',
  '1BHK': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=85',
  '2BHK': 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=85',
  '3BHK': 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&q=85',
  '4BHK': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85',
  'default': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85',
};

function getImage(room) {
  if (room.images?.[0]) return resolveImageUrl(room.images[0]);
  return FALLBACK_IMAGES[room.type] || FALLBACK_IMAGES['default'];
}

/* ══════════════════════════════════════════════════════
   STAYS BANNER — photographic editorial header
══════════════════════════════════════════════════════ */
function StaysBanner() {
  return (
    <header className="stays-banner" aria-label="Stays page header">
      {/* Background image */}
      <img
        src={BANNER_IMG}
        alt="Mysuru Palace — City of Palaces"
        className="stays-banner__img"
        loading="eager"
        fetchPriority="high"
      />
      {/* Gradient overlay — text-side darkening */}
      <div className="stays-banner__overlay" aria-hidden="true" />

      {/* Text content */}
      <div className="container stays-banner__content">
        <span className="stays-banner__label">OUR STAYS</span>
        <h1 className="stays-banner__title">Find your stay.</h1>
        <p className="stays-banner__desc">
          Homes and rooms around Mysuru,<br className="stays-banner__br" />
          with Namaste Nest as our featured stay.
        </p>
        <p className="stays-banner__location" aria-label="Location: Gokulam, Mysuru">
          Gokulam · Mysuru
        </p>
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════════════════
   FEATURED STAY — Namaste Nest
══════════════════════════════════════════════════════ */
function FeaturedStay({ room }) {
  const img = getImage(room);

  return (
    <section className="featured-stay" aria-labelledby="featured-heading">
      <div className="container">
        <header className="featured-stay__label-row">
          <span className="section-label">FEATURED STAY</span>
        </header>

        <div className="featured-stay__card">
          {/* Image — full left panel, clickable */}
          <Link
            to={`/rooms/${room.slug}`}
            className="featured-stay__image-link"
            tabIndex={-1}
            aria-hidden="true"
          >
            <div className="featured-stay__image-wrap">
              <img
                src={img}
                alt={`${room.name} — featured stay`}
                className="featured-stay__img"
                loading="eager"
              />
            </div>
          </Link>

          {/* Info panel */}
          <div className="featured-stay__body">
            {room.type && (
              <span className="featured-stay__type" aria-label={`Property type: ${room.type}`}>
                {room.type}
              </span>
            )}

            <h2 id="featured-heading" className="featured-stay__name">
              <Link to={`/rooms/${room.slug}`} className="featured-stay__name-link">
                {room.name}
              </Link>
            </h2>

            {(room.capacity || room.bedrooms || room.bathrooms) && (
              <div className="featured-stay__specs">
                {room.capacity && <span><FiUsers size={13} aria-hidden="true" /> {room.capacity} guests</span>}
                {room.bedrooms && <span><MdOutlineKingBed size={14} aria-hidden="true" /> {room.bedrooms} bed{room.bedrooms > 1 ? 's' : ''}</span>}
                {room.bathrooms && <span><FiDroplet size={13} aria-hidden="true" /> {room.bathrooms} bath{room.bathrooms > 1 ? 's' : ''}</span>}
              </div>
            )}

            {room.price && (
              <div className="featured-stay__price-block">
                <span className="featured-stay__price">₹{room.price.toLocaleString('en-IN')}</span>
                <span className="featured-stay__price-night"> / night</span>
              </div>
            )}

            {/* Airbnb trust bar — NAMASTE NEST ONLY */}
            <div
              className="featured-stay__trust"
              aria-label="5.0 out of 5 on Airbnb, 12 plus reviews, Guest favourite"
            >
              <span className="featured-stay__stars" aria-hidden="true">★ 5.0</span>
              <span className="featured-stay__trust-sep" aria-hidden="true">·</span>
              <span className="featured-stay__reviews">12+ Airbnb reviews</span>
              <span className="featured-stay__fav-pill">Guest favourite</span>
            </div>

            {(room.shortDesc || room.description) && (
              <p className="featured-stay__desc">
                {room.shortDesc
                  ? room.shortDesc
                  : (room.description || '').slice(0, 130) +
                  ((room.description || '').length > 130 ? '…' : '')}
              </p>
            )}

            {room.amenities?.length > 0 && (
              <ul className="featured-stay__amenities" aria-label="Key amenities">
                {room.amenities.slice(0, 5).map(a => (
                  <li key={a} className="featured-stay__amenity">{a}</li>
                ))}
              </ul>
            )}

            <div className="featured-stay__ctas">
              <Link
                to={`/rooms/${room.slug}`}
                className="featured-stay__view-btn"
                aria-label={`View ${room.name} full details`}
              >
                View stay <FiArrowRight size={15} aria-hidden="true" />
              </Link>
              <a
                href={AIRBNB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="featured-stay__airbnb-btn"
                aria-label="View Namaste Nest on Airbnb (opens in new tab)"
              >
                <SiAirbnb size={15} aria-hidden="true" />
                See us on Airbnb
                <FiExternalLink size={12} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SKELETON LOADERS
══════════════════════════════════════════════════════ */
function FeaturedSkeleton() {
  return (
    <section className="featured-stay">
      <div className="container">
        <div className="sk sk--label" style={{ marginBottom: 24 }} />
        <div className="featured-stay__card sk-featured-card">
          <div className="sk sk--full-block" />
          <div className="featured-stay__body">
            <div className="sk sk--pill" style={{ marginBottom: 14 }} />
            <div className="sk sk--h2" style={{ marginBottom: 16 }} />
            <div className="sk sk--row" style={{ marginBottom: 18 }} />
            <div className="sk sk--price" style={{ marginBottom: 16 }} />
            <div className="sk sk--trust" style={{ marginBottom: 18 }} />
            <div className="sk sk--line" style={{ marginBottom: 10 }} />
            <div className="sk sk--line sk--short" style={{ marginBottom: 24 }} />
            <div className="sk sk--btns" />
          </div>
        </div>
      </div>
    </section>
  );
}

function GridSkeleton() {
  return (
    <div className="stays-grid" aria-busy="true" aria-label="Loading stays">
      {[1, 2, 3].map(i => (
        <div key={i} className="sk-card" aria-hidden="true">
          <div className="sk sk--card-img" />
          <div className="sk-card__body">
            <div className="sk sk--line" style={{ marginBottom: 10 }} />
            <div className="sk sk--line sk--short" style={{ marginBottom: 14 }} />
            <div className="sk sk--price" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   HOW IT WORKS
══════════════════════════════════════════════════════ */
const HOW_STEPS = [
  { num: '01', title: 'Choose a stay', desc: 'Browse the stays and find one that suits your visit to Mysuru.' },
  { num: '02', title: 'View the details', desc: 'Check the property information, amenities and pricing.' },
  { num: '03', title: 'Get in touch', desc: 'Contact us to ask about your dates, availability and booking.' },
];

function HowItWorks() {
  return (
    <section className="how-it-works" aria-labelledby="how-heading">
      <div className="container">
        <div className="how-it-works__head">
          <span className="section-label">SIMPLE PROCESS</span>
          <h2 id="how-heading" className="how-it-works__title">How stays work.</h2>
        </div>
        <div className="how-it-works__steps">
          {HOW_STEPS.map(s => (
            <div key={s.num} className="how-it-works__step">
              <span className="how-num" aria-hidden="true">{s.num}</span>
              <h3 className="how-step-title">{s.title}</h3>
              <p className="how-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   PLAN YOUR VISIT CTA — warm sandstone, NOT dark
══════════════════════════════════════════════════════ */
function PlanYourVisit() {
  return (
    <section className="stays-cta" aria-label="Plan your visit to Mysuru">
      <div className="container stays-cta__inner">
        <div className="stays-cta__ornament" aria-hidden="true">✦</div>
        <span className="stays-cta__label">PLAN YOUR VISIT</span>
        <h2 className="stays-cta__title">Planning your stay in Mysuru?</h2>
        <div className="stays-cta__divider" aria-hidden="true" />
        <p className="stays-cta__desc">
          Have questions about a property or your visit?<br />
          Get in touch and we'll help you find the right place.
        </p>
        <div className="stays-cta__btns">
          <Link to="/contact" className="stays-cta__primary" aria-label="Contact Namaste Nest">
            Contact Us
          </Link>
          <Link to="/location" className="stays-cta__secondary" aria-label="Explore Gokulam neighbourhood">
            Explore Location
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
export default function Rooms() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeType, setActiveType] = useState(searchParams.get('type') || 'All');
  const [search, setSearch] = useState('');

  // Sync state when searchParams change (e.g. from footer links)
  useEffect(() => {
    const typeFromUrl = searchParams.get('type');
    if (typeFromUrl && TYPES.some(t => t.value === typeFromUrl)) {
      setActiveType(typeFromUrl);
    } else if (!typeFromUrl) {
      setActiveType('All');
    }
  }, [searchParams]);

  const handleTypeChange = (val) => {
    setActiveType(val);
    const nextParams = new URLSearchParams(searchParams);
    if (val === 'All') {
      nextParams.delete('type');
    } else {
      nextParams.set('type', val);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const fetchRooms = () => {
    setLoading(true);
    setError(false);
    axios.get(`${API}/properties`)
      .then(r => setRooms(r.data.data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRooms(); }, []);

  /* Split on isFeatured — never fallback to rooms[0] */
  const featured = rooms.find(r => r.isFeatured === true);
  const otherRooms = rooms.filter(r => r.isFeatured !== true);

  /* Filter other stays — no sorting */
  const filteredOthers = (() => {
    let result = otherRooms;
    if (activeType !== 'All') result = result.filter(r => r.type === activeType);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q)
      );
    }
    return result;
  })();

  /* Featured visibility under current filter */
  const featuredPassesFilter =
    activeType === 'All' || featured?.type === activeType;
  const featuredPassesSearch = !search.trim() ||
    (featured?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (featured?.description || '').toLowerCase().includes(search.toLowerCase());
  const showFeatured = !!featured && featuredPassesFilter && featuredPassesSearch;

  const clearFilters = () => {
    setActiveType('All');
    setSearch('');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('type');
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div className="stays-page">

      {/* ── BANNER ── */}
      <StaysBanner />

      {/* ── ERROR ── */}
      {error && !loading && (
        <div className="container">
          <div className="stays-error" role="alert">
            <p className="stays-error__title">We couldn't load the stays.</p>
            <p className="stays-error__sub">Please try again in a moment.</p>
            <button
              className="btn-outline stays-error__retry"
              onClick={fetchRooms}
              aria-label="Retry loading stays"
            >
              <FiRefreshCw size={14} aria-hidden="true" /> Try again
            </button>
          </div>
        </div>
      )}

      {/* ── FEATURED STAY ── */}
      {!error && (
        loading ? <FeaturedSkeleton /> : showFeatured && <FeaturedStay room={featured} />
      )}

      {/* ── OTHER STAYS ── */}
      {!error && (
        <section className="stays-section" aria-labelledby="other-heading">
          <div className="container">
            <div className="stays-section__head">
              <span className="section-label">EXPLORE OTHER STAYS</span>
              <h2 id="other-heading" className="stays-section__title">Other stays.</h2>
              <p className="stays-section__desc">
                Browse other stays listed on Namaste Nest and get in touch with us
                for details, availability and booking.
              </p>
            </div>

            {/* Controls — search + type filters only, no sort */}
            <div className="stays-controls" role="search">
              <div className="stays-search">
                <FiSearch size={15} aria-hidden="true" />
                <input
                  type="search"
                  id="stays-search-input"
                  placeholder="Search stays..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  aria-label="Search stays by name or description"
                />
              </div>

              <div
                className="stays-filters"
                role="group"
                aria-label="Filter by property type"
              >
                {TYPES.map(t => (
                  <button
                    key={t.value}
                    className={`stays-filter-btn${activeType === t.value ? ' active' : ''}`}
                    onClick={() => handleTypeChange(t.value)}
                    aria-pressed={activeType === t.value}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Result count */}
            {!loading && filteredOthers.length > 0 && (
              <p className="stays-count" aria-live="polite">
                {filteredOthers.length} stay{filteredOthers.length !== 1 ? 's' : ''} to explore
              </p>
            )}

            {/* Grid / states */}
            {loading ? (
              <GridSkeleton />
            ) : filteredOthers.length > 0 ? (
              <div className="stays-grid">
                {filteredOthers.map(r => (
                  <RoomCard key={r._id} room={r} />
                ))}
              </div>
            ) : (
              <div className="stays-empty" role="status">
                <p className="stays-empty__title">No stays found.</p>
                <p className="stays-empty__sub">
                  Try another search or choose a different stay type.
                </p>
                <button
                  className="btn-outline stays-empty__clear"
                  onClick={clearFilters}
                  aria-label="Clear all filters"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ── */}
      <HowItWorks />

      {/* ── PLAN YOUR VISIT ── */}
      <PlanYourVisit />
    </div>
  );
}

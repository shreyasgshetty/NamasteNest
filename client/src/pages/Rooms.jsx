import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSearch, FiArrowRight, FiUsers, FiExternalLink,
  FiRefreshCw, FiDroplet, FiChevronDown,
} from 'react-icons/fi';
import { MdOutlineKingBed } from 'react-icons/md';
import { SiAirbnb } from 'react-icons/si';
import RoomCard from '../components/RoomCard';
import { resolveImageUrl } from '../utils/imageUrl';
import axios from 'axios';
import './Rooms.css';

const API   = import.meta.env.VITE_API_URL;
const TYPES = ['All', 'Studio', '1BHK', '2BHK', '3BHK', '4BHK'];
const SORTS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'name-asc',    label: 'Name: A–Z' },
  { value: 'name-desc',   label: 'Name: Z–A' },
  { value: 'price-asc',   label: 'Price: Low → High' },
  { value: 'price-desc',  label: 'Price: High → Low' },
];

/* Verified Namaste Nest Airbnb listing */
const AIRBNB_URL = 'https://www.airbnb.com.sg/rooms/1669361340542473773';

const FALLBACK_IMAGES = {
  'Studio': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85',
  '1BHK':   'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=85',
  '2BHK':   'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=85',
  '3BHK':   'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&q=85',
  '4BHK':   'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85',
  'default':'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85',
};

function getImage(room, size = 'default') {
  if (room.images?.[0]) return resolveImageUrl(room.images[0]);
  return FALLBACK_IMAGES[room.type] || FALLBACK_IMAGES['default'];
}

function applySorting(list, sortBy) {
  if (sortBy === 'name-asc')   return [...list].sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === 'name-desc')  return [...list].sort((a, b) => b.name.localeCompare(a.name));
  if (sortBy === 'price-asc')  return [...list].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  if (sortBy === 'price-desc') return [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  return list;
}

/* ══════════════════════════════════════════════════════
   FEATURED STAY — Namaste Nest
   Entire card is clickable (Link wraps the content).
   Airbnb information is exclusive to this section.
══════════════════════════════════════════════════════ */
function FeaturedStay({ room }) {
  const img = getImage(room);

  return (
    <section className="featured-stay" aria-labelledby="featured-heading">
      <div className="container">
        <header className="featured-stay__header">
          <span className="section-label">FEATURED STAY</span>
        </header>

        <div className="featured-stay__card">
          {/* Image — clicking navigates to detail */}
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
              <div className="featured-stay__img-overlay" aria-hidden="true" />
            </div>
          </Link>

          {/* Info panel */}
          <div className="featured-stay__body">
            {/* Type pill */}
            {room.type && (
              <span className="featured-stay__type" aria-label={`Property type: ${room.type}`}>
                {room.type}
              </span>
            )}

            {/* Name */}
            <h2 id="featured-heading" className="featured-stay__name">
              <Link to={`/rooms/${room.slug}`} className="featured-stay__name-link">
                {room.name}
              </Link>
            </h2>

            {/* Spec row */}
            {(room.capacity || room.bedrooms || room.bathrooms) && (
              <div className="featured-stay__specs">
                {room.capacity  && <span><FiUsers size={13} aria-hidden="true" /> {room.capacity} guests</span>}
                {room.bedrooms  && <span><MdOutlineKingBed size={14} aria-hidden="true" /> {room.bedrooms} bed{room.bedrooms > 1 ? 's' : ''}</span>}
                {room.bathrooms && <span><FiDroplet size={13} aria-hidden="true" /> {room.bathrooms} bath{room.bathrooms > 1 ? 's' : ''}</span>}
              </div>
            )}

            {/* Price */}
            {room.price && (
              <div className="featured-stay__price-block">
                <span className="featured-stay__price">₹{room.price.toLocaleString('en-IN')}</span>
                <span className="featured-stay__price-night"> / night</span>
              </div>
            )}

            {/* Airbnb trust bar — NAMASTE NEST ONLY */}
            <div className="featured-stay__trust" aria-label="5.0 out of 5 on Airbnb, 12 plus reviews, Guest favourite">
              <span className="featured-stay__stars" aria-hidden="true">★ 5.0</span>
              <span className="featured-stay__trust-sep" aria-hidden="true">·</span>
              <span className="featured-stay__reviews">12+ Airbnb reviews</span>
              <span className="featured-stay__fav-pill">Guest favourite</span>
            </div>

            {/* Short description */}
            {(room.shortDesc || room.description) && (
              <p className="featured-stay__desc">
                {room.shortDesc
                  ? room.shortDesc
                  : (room.description || '').slice(0, 130) + ((room.description || '').length > 130 ? '…' : '')}
              </p>
            )}

            {/* Amenities preview */}
            {room.amenities?.length > 0 && (
              <ul className="featured-stay__amenities" aria-label="Key amenities">
                {room.amenities.slice(0, 5).map(a => (
                  <li key={a} className="featured-stay__amenity">{a}</li>
                ))}
              </ul>
            )}

            {/* CTAs */}
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
   SKELETON LOADERS — warm shimmer
══════════════════════════════════════════════════════ */
function FeaturedSkeleton() {
  return (
    <section className="featured-stay">
      <div className="container">
        <div className="sk sk--label mb-28" />
        <div className="featured-stay__card sk-featured">
          <div className="featured-stay__image-wrap sk sk--block" />
          <div className="featured-stay__body sk-body">
            <div className="sk sk--pill mb-14" />
            <div className="sk sk--h2 mb-16" />
            <div className="sk sk--row mb-18" />
            <div className="sk sk--price mb-16" />
            <div className="sk sk--trust mb-18" />
            <div className="sk sk--line mb-10" />
            <div className="sk sk--line sk--short mb-24" />
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
            <div className="sk sk--line mb-10" />
            <div className="sk sk--line sk--short mb-16" />
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
  { num: '01', title: 'Choose a stay',    desc: 'Browse the stays and find one that suits your visit to Mysuru.' },
  { num: '02', title: 'View the details', desc: 'Check the property information, amenities and pricing.' },
  { num: '03', title: 'Get in touch',     desc: 'Contact us to ask about your dates, availability and booking.' },
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
   GOKULAM CONTEXT
══════════════════════════════════════════════════════ */
function GokulamContext() {
  return (
    <section className="gokulam-ctx" aria-label="About Gokulam neighbourhood">
      <div className="container gokulam-ctx__inner">
        <div className="gokulam-ctx__text">
          <span className="section-label">THE NEIGHBOURHOOD</span>
          <h2 className="gokulam-ctx__title">Stay in Gokulam.</h2>
          <div className="gold-divider" />
          <p className="gokulam-ctx__desc">
            A calm residential neighbourhood known for its yoga community, cafés
            and convenient access around Mysuru.
          </p>
          <Link to="/location" className="btn-outline gokulam-ctx__link" aria-label="Explore Gokulam neighbourhood">
            Explore Gokulam <FiArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <div className="gokulam-ctx__pattern" aria-hidden="true">
          <div className="gokulam-ctx__orb" />
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   FINAL CTA
══════════════════════════════════════════════════════ */
function FinalCTA() {
  return (
    <section className="stays-cta" aria-label="Contact and planning">
      <div className="container stays-cta__inner">
        <span className="section-label">PLAN YOUR VISIT</span>
        <h2 className="stays-cta__title">Planning your stay in Mysuru?</h2>
        <p className="stays-cta__desc">
          Have questions about a property or your visit? Get in touch and we'll
          help you find the right place.
        </p>
        <div className="stays-cta__btns">
          <Link to="/contact" className="stays-cta__primary" aria-label="Contact Namaste Nest">
            Contact Us
          </Link>
          <Link to="/location" className="stays-cta__secondary" aria-label="Get directions">
            Get Directions
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
  const [rooms,      setRooms]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(false);
  const [activeType, setActiveType] = useState('All');
  const [search,     setSearch]     = useState('');
  const [sortBy,     setSortBy]     = useState('recommended');

  const fetchRooms = () => {
    setLoading(true);
    setError(false);
    axios.get(`${API}/properties`)
      .then(r  => setRooms(r.data.data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRooms(); }, []);

  /* Split on isFeatured — never fallback to rooms[0] */
  const featured   = rooms.find(r => r.isFeatured === true);
  const otherRooms = rooms.filter(r => r.isFeatured !== true);

  /* Filter + sort other stays */
  const filteredOthers = (() => {
    let result = otherRooms;
    if (activeType !== 'All') result = result.filter(r => r.type === activeType);
    if (search.trim()) {
      const q = search.toLowerCase();
      result  = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q)
      );
    }
    return applySorting(result, sortBy);
  })();

  /* Featured visibility under active type filter */
  const featuredPassesFilter =
    activeType === 'All' || featured?.type === activeType;
  const featuredPassesSearch = !search.trim() ||
    (featured?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (featured?.description || '').toLowerCase().includes(search.toLowerCase());

  const showFeatured = !!featured && featuredPassesFilter && featuredPassesSearch;

  const clearFilters = () => { setActiveType('All'); setSearch(''); };

  return (
    <div className="stays-page">

      {/* ── HEADER ── */}
      <header className="stays-header">
        <div className="container stays-header__inner">
          <span className="section-label">OUR STAYS</span>
          <h1 className="stays-header__title">Find your stay.</h1>
          <p className="stays-header__desc">
            Homes and rooms around Mysuru, with Namaste Nest as our featured stay.
          </p>
          <p className="stays-header__location" aria-label="Location">
            Gokulam · Mysuru
          </p>
        </div>
      </header>

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
            {/* Section header */}
            <div className="stays-section__head">
              <span className="section-label">EXPLORE OTHER STAYS</span>
              <h2 id="other-heading" className="stays-section__title">Other stays.</h2>
              <p className="stays-section__desc">
                Browse other stays listed on Namaste Nest and get in touch with us
                for details, availability and booking.
              </p>
            </div>

            {/* Controls */}
            <div className="stays-controls" role="search">
              {/* Search */}
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

              {/* Type filters */}
              <div
                className="stays-filters"
                role="group"
                aria-label="Filter by property type"
              >
                {TYPES.map(t => (
                  <button
                    key={t}
                    className={`stays-filter-btn${activeType === t ? ' active' : ''}`}
                    onClick={() => setActiveType(t)}
                    aria-pressed={activeType === t}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="stays-sort-wrap">
                <label htmlFor="stays-sort" className="stays-sort-label">Sort</label>
                <div className="stays-sort-select-wrap">
                  <select
                    id="stays-sort"
                    className="stays-sort"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    aria-label="Sort stays"
                  >
                    {SORTS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <FiChevronDown size={13} className="stays-sort-icon" aria-hidden="true" />
                </div>
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

      {/* ── GOKULAM ── */}
      <GokulamContext />

      {/* ── FINAL CTA ── */}
      <FinalCTA />
    </div>
  );
}

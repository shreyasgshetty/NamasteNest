import { Link } from 'react-router-dom';
import {
  FiMapPin,
  FiNavigation,
  FiClock,
  FiArrowUpRight,
  FiArrowRight,
} from 'react-icons/fi';
import { TbTrain, TbBus, TbPlane } from 'react-icons/tb';
import './Location.css';

/* ── Verified Mysuru Attractions (Curated editorial selection) ── */
const ATTRACTIONS = [
  {
    name: 'Mysuru Palace',
    desc: 'Royal heritage and iconic Indo-Saracenic seat of the Wadiyar dynasty',
    distance: '~6 km',
    time: '~15 min by car',
  },
  {
    name: 'Devaraja Market',
    desc: 'Vibrant century-old bazaar renowned for fresh flowers, spices, and local Mysore sweets',
    distance: '~5 km',
    time: '~10 min by car',
  },
  {
    name: "St. Philomena's Cathedral",
    desc: 'Majestic Neo-Gothic cathedral featuring twin 175-foot spires and stained-glass halls',
    distance: '~5.5 km',
    time: '~15 min by car',
  },
  {
    name: 'Mysuru Zoo',
    desc: 'One of India’s oldest and most renowned zoological gardens, set amidst lush botanical grounds',
    distance: '~7 km',
    time: '~20 min by car',
  },
  {
    name: 'Chamundi Hills',
    desc: 'Historic hilltop temple dedicated to Goddess Chamundeshwari, offering panoramic city vistas',
    distance: '~17 km',
    time: '~30 min by car',
  },
  {
    name: 'Brindavan Gardens',
    desc: 'Symmetrical terraced gardens, illuminated fountains, and botanical walkways by the KRS Dam',
    distance: '~18 km',
    time: '~30 min by car',
  },
];

/* ── Transportation & Access Hubs ── */
const GETTING_HERE = [
  {
    name: 'Mysuru Railway Station',
    distance: '~4 km',
    time: '~10 min by car',
    label: 'Primary rail junction connecting Bengaluru, Chennai, and regional routes across South India',
    icon: TbTrain,
  },
  {
    name: 'KSRTC Bus Stand',
    distance: '~6 km',
    time: '~15 min by car',
    label: 'Central bus terminus for intercity express coaches and airport Flybus transit',
    icon: TbBus,
  },
  {
    name: 'Mysuru Airport',
    distance: '~15 km',
    time: '~30 min by car',
    label: 'Domestic airport at Mandakalli with scheduled commercial flights connecting to major metros',
    icon: TbPlane,
  },
];

const MAPS_DIRECTIONS_URL = 'https://maps.app.goo.gl/Rk7bUzdaPRY5pz1q7';
const MAPS_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d600.2582578270255!2d76.62699596171352!3d12.33587359001278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf7a62f4fdae7d%3A0x5462a934a51ca1f3!2s959!5e0!3m2!1sen!2sin!4v1780754938682!5m2!1sen!2sin';

export default function Location() {
  return (
    <div className="location-page">
      {/* ── 1. WARM EDITORIAL HERO ── */}
      <header className="location-hero" aria-label="Location overview">
        <div className="container location-hero__inner">
          <span className="section-label">GOKULAM, MYSURU</span>
          <h1 className="location-hero__title">Our Location</h1>
          <p className="location-hero__sub">
            Nestled in the tranquil residential avenues of Gokulam 3rd Stage, known for its quiet
            streets, heritage calm, and proximity to Mysuru’s renowned sights.
          </p>

          <div className="location-hero__address-badge">
            <FiMapPin className="location-hero__pin-icon" size={16} />
            <span>959, 7th Main, Gokulam 3rd Stage, Mysuru, Karnataka 570002</span>
          </div>

          <div className="location-hero__actions">
            <a
              href={MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary location-hero__btn"
            >
              <FiNavigation size={15} />
              <span>Get Directions in Google Maps</span>
            </a>
          </div>
        </div>
      </header>

      <div className="container location-page__body">
        {/* ── 2. MAP SECTION ── */}
        <section className="location-map-section" aria-label="Interactive Google Map">
          <div className="location-map__wrap">
            <iframe
              title="Namaste Nest Location - Gokulam, Mysuru"
              src={MAPS_EMBED_URL}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="location-map__iframe"
            />

            {/* Frosted hospitality card over map */}
            <div className="location-map__card">
              <div className="location-map__card-pin">
                <FiMapPin size={20} />
              </div>
              <div className="location-map__card-content">
                <strong className="location-map__card-name">Namaste Nest Guest House</strong>
                <address className="location-map__card-address">
                  959, 7th Main, Gokulam 3rd Stage,<br />
                  Mysuru, Karnataka 570002
                </address>
              </div>
              <a
                href={MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="location-map__card-link"
                aria-label="Open Namaste Nest in Google Maps"
              >
                <FiNavigation size={14} />
                <span>Open Maps</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── 3. EXPLORE MYSURU — ATTRACTIONS EDITORIAL LIST ── */}
        <section className="location-explore" aria-labelledby="explore-title">
          <div className="location-explore__head">
            <span className="section-label">EXPLORE MYSURU</span>
            <h2 id="explore-title" className="section-title">
              Places worth discovering from Namaste Nest
            </h2>
            <div className="gold-divider" />
            <p className="section-sub">
              Discover some of Mysuru's best-known sights, from royal heritage and bustling markets
              to landscaped gardens and hilltop views.
            </p>
          </div>

          <div className="location-attractions-list" role="list">
            {ATTRACTIONS.map((item, idx) => (
              <article
                key={item.name}
                className="location-attraction-row"
                role="listitem"
              >
                <div className="location-attraction-row__main">
                  <div className="location-attraction-row__index" aria-hidden="true">
                    0{idx + 1}
                  </div>
                  <div className="location-attraction-row__text">
                    <h3 className="location-attraction-row__name">{item.name}</h3>
                    <p className="location-attraction-row__desc">{item.desc}</p>
                  </div>
                </div>

                <div className="location-attraction-row__meta">
                  <span className="location-meta-chip" title="Distance from Namaste Nest">
                    <FiMapPin size={13} className="location-meta-chip__icon" />
                    <span>{item.distance}</span>
                  </span>
                  <span className="location-meta-chip" title="Approximate travel time by car">
                    <FiClock size={13} className="location-meta-chip__icon" />
                    <span>{item.time}</span>
                  </span>
                  <div className="location-attraction-row__arrow" aria-hidden="true">
                    <FiArrowUpRight size={17} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="location-disclaimer">
            * Approximate distances and travel times from Namaste Nest. Travel times may vary with traffic.
          </p>
        </section>

        {/* ── 4. GETTING HERE — TRANSPORTATION HUBS ── */}
        <section className="location-transit" aria-labelledby="transit-title">
          <div className="location-transit__head">
            <span className="section-label">GETTING HERE</span>
            <h2 id="transit-title" className="section-title">
              Well connected to the city
            </h2>
            <div className="gold-divider" />
            <p className="section-sub">
              Reach Namaste Nest easily by rail, road or air.
            </p>
          </div>

          <div className="location-transit-grid">
            {GETTING_HERE.map((hub) => {
              const IconComponent = hub.icon;
              return (
                <article key={hub.name} className="location-transit-card">
                  <div className="location-transit-card__icon-wrap" aria-hidden="true">
                    <IconComponent size={24} />
                  </div>
                  <h3 className="location-transit-card__name">{hub.name}</h3>
                  <div className="location-transit-card__chips">
                    <span className="location-meta-chip">
                      <FiMapPin size={13} className="location-meta-chip__icon" />
                      <span>{hub.distance}</span>
                    </span>
                    <span className="location-meta-chip">
                      <FiClock size={13} className="location-meta-chip__icon" />
                      <span>{hub.time}</span>
                    </span>
                  </div>
                  <p className="location-transit-card__label">{hub.label}</p>
                </article>
              );
            })}
          </div>

          <p className="location-disclaimer">
            * Travel times are approximate and may vary with traffic.
          </p>
        </section>
      </div>

      {/* ── 5. PLAN YOUR VISIT CTA ── */}
      <section className="location-cta" aria-labelledby="location-cta-heading">
        <div className="container location-cta__inner">
          <span className="section-label">PLAN YOUR VISIT</span>
          <h2 id="location-cta-heading" className="location-cta__title">
            Ready to Visit Mysuru?
          </h2>
          <div className="location-cta__divider" />
          <p className="location-cta__sub">
            Enjoy a peaceful and memorable stay at Namaste Nest in the heart of Gokulam.
          </p>
          <div className="location-cta__actions">
            <Link to="/rooms" className="btn-primary location-cta__btn">
              <span>Explore Stays</span>
              <FiArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn-outline location-cta__btn">
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

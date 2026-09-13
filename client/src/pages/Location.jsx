import { Link } from 'react-router-dom';
import {
  FiMapPin,
  FiNavigation,
  FiArrowRight,
} from 'react-icons/fi';
import { TbTrain, TbBus, TbPlane } from 'react-icons/tb';
import './Location.css';

/* ── Exact Wikimedia Commons Destination Images ── */
const PALACE_IMG =
  'https://upload.wikimedia.org/wikipedia/commons/7/74/Exterior_of_the_Mysore_Palace%2C_Mysore%2C_Karnataka%2C_2018.jpg';
const DEVARAJA_IMG =
  'https://upload.wikimedia.org/wikipedia/commons/e/eb/Devaraja_market_in_Mysore_%28Karnataka%2C_India_2023%29_%2852717164759%29.jpg';
const PHILOMENAS_IMG =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Beautiful_Exterior_view_of_St._Philomena%E2%80%99s_Cathedral%2C_Mysuru%2C_Karnataka.jpg/960px-Beautiful_Exterior_view_of_St._Philomena%E2%80%99s_Cathedral%2C_Mysuru%2C_Karnataka.jpg';
const ZOO_IMG =
  'https://upload.wikimedia.org/wikipedia/commons/0/07/Zoo_entrance_gate.JPG';
const CHAMUNDI_IMG =
  'https://upload.wikimedia.org/wikipedia/commons/6/64/Mysore_Chamundeshwari_Temple.jpg';
const BRINDAVAN_IMG =
  'https://upload.wikimedia.org/wikipedia/commons/9/98/Brindavan_Gardens%2C_Mysore_%283618327523%29.jpg';

/* ── Transportation & Access Hubs ── */
const GETTING_HERE = [
  {
    name: 'Mysuru Railway Station',
    meta: '~4 km · ~10 min by car',
    icon: TbTrain,
  },
  {
    name: 'KSRTC Bus Stand',
    meta: '~6 km · ~15 min by car',
    icon: TbBus,
  },
  {
    name: 'Mysuru Airport',
    meta: '~15 km · ~30 min by car',
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

        {/* ── 3. EXPLORE MYSURU — PHOTOGRAPHY-LED EDITORIAL DESTINATION GALLERY ── */}
        <section className="location-explore" aria-labelledby="explore-title">
          <div className="location-explore__head">
            <span className="section-label">EXPLORE MYSURU</span>
            <h2 id="explore-title" className="section-title">
              Places worth discovering
            </h2>
            <div className="gold-divider" />
            <p className="section-sub">
              Discover a few of Mysuru's most memorable sights, all within easy reach of Namaste Nest.
            </p>
          </div>

          <div className="location-gallery-mosaic">
            {/* Top Tier: Dominant Palace + Stacked Devaraja & St. Philomena's */}
            <div className="location-gallery__top">
              {/* Dominant Feature: Mysuru Palace */}
              <article className="location-tile location-tile--dominant">
                <img
                  src={PALACE_IMG}
                  alt="Mysuru Palace exterior illuminated against sky"
                  className="location-tile__img"
                  loading="lazy"
                />
                <div className="location-tile__overlay" />
                <div className="location-tile__info">
                  <h3 className="location-tile__title">Mysuru Palace</h3>
                  <p className="location-tile__meta">~6 km · ~15 min by car</p>
                </div>
              </article>

              {/* Medium Stacked: Devaraja Market & St. Philomena's Cathedral */}
              <div className="location-gallery__stacked">
                <article className="location-tile location-tile--medium location-tile--devaraja">
                  <img
                    src={DEVARAJA_IMG}
                    alt="Devaraja Market in Mysuru"
                    className="location-tile__img"
                    loading="lazy"
                  />
                  <div className="location-tile__overlay" />
                  <div className="location-tile__info">
                    <h3 className="location-tile__title">Devaraja Market</h3>
                    <p className="location-tile__meta">~5 km · ~10 min by car</p>
                  </div>
                </article>

                <article className="location-tile location-tile--medium location-tile--philomena">
                  <img
                    src={PHILOMENAS_IMG}
                    alt="St. Philomena's Cathedral twin towers"
                    className="location-tile__img"
                    loading="lazy"
                  />
                  <div className="location-tile__overlay" />
                  <div className="location-tile__info">
                    <h3 className="location-tile__title">St. Philomena's Cathedral</h3>
                    <p className="location-tile__meta">~5.5 km · ~15 min by car</p>
                  </div>
                </article>
              </div>
            </div>

            {/* Bottom Row: Mysuru Zoo, Chamundi Hills, Brindavan Gardens */}
            <div className="location-gallery__bottom">
              <article className="location-tile location-tile--small location-tile--zoo">
                <img
                  src={ZOO_IMG}
                  alt="Entrance gate of Mysuru Zoo"
                  className="location-tile__img"
                  loading="lazy"
                />
                <div className="location-tile__overlay" />
                <div className="location-tile__info">
                  <h3 className="location-tile__title">Mysuru Zoo</h3>
                  <p className="location-tile__meta">~7 km · ~20 min by car</p>
                </div>
              </article>

              <article className="location-tile location-tile--small location-tile--chamundi">
                <img
                  src={CHAMUNDI_IMG}
                  alt="Chamundeshwari Temple atop Chamundi Hills"
                  className="location-tile__img"
                  loading="lazy"
                />
                <div className="location-tile__overlay" />
                <div className="location-tile__info">
                  <h3 className="location-tile__title">Chamundi Hills</h3>
                  <p className="location-tile__meta">~17 km · ~30 min by car</p>
                </div>
              </article>

              <article className="location-tile location-tile--small location-tile--brindavan">
                <img
                  src={BRINDAVAN_IMG}
                  alt="Terraced landscapes and fountains at Brindavan Gardens"
                  className="location-tile__img"
                  loading="lazy"
                />
                <div className="location-tile__overlay" />
                <div className="location-tile__info">
                  <h3 className="location-tile__title">Brindavan Gardens</h3>
                  <p className="location-tile__meta">~18 km · ~30 min by car</p>
                </div>
              </article>
            </div>
          </div>

          <div className="location-gallery__footer">
            <p className="location-disclaimer">
              Approximate distances and travel times from Namaste Nest. Travel times may vary with traffic.
            </p>
            <p className="location-attribution">
              Photos sourced via Wikimedia Commons under Creative Commons licenses.
            </p>
          </div>
        </section>

        {/* ── 4. GETTING HERE — TRANSPORTATION ACCESS POINTS ── */}
        <section className="location-transit" aria-labelledby="transit-title">
          <div className="location-transit__head">
            <span className="section-label">GETTING HERE</span>
            <h2 id="transit-title" className="section-title">
              Getting to Namaste Nest
            </h2>
            <div className="gold-divider" />
            <p className="section-sub">
              Convenient connections by rail, road and air.
            </p>
          </div>

          <div className="location-transit-grid">
            {GETTING_HERE.map((hub) => {
              const IconComponent = hub.icon;
              return (
                <article key={hub.name} className="location-transit-card">
                  <div className="location-transit-card__icon-wrap" aria-hidden="true">
                    <IconComponent size={22} />
                  </div>
                  <div className="location-transit-card__text">
                    <h3 className="location-transit-card__name">{hub.name}</h3>
                    <p className="location-transit-card__meta">{hub.meta}</p>
                  </div>
                </article>
              );
            })}
          </div>
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

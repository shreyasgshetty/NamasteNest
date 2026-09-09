import './MysuruIntro.css';

/*
 * MYSURU PALACE IMAGE — alternate palace photo
 * Unsplash page: https://unsplash.com/photos/G3fBusx_U6A
 * To get working CDN URL: open link → right-click image → "Open image in new tab" → copy that URL.
 */
const PALACE_IMG = 'https://i.pinimg.com/1200x/23/9b/69/239b69ad123e115cf6a816695c02d6ec.jpg?auto=format&fit=crop&fm=jpg&q=85&w=1600';

const highlights = [
  { place: 'Mysuru Palace', note: 'Heritage & architecture' },
  { place: 'Chamundi Hills', note: 'Views over the city' },
  { place: 'Devaraja Market', note: 'Local life & colour' },
];

export default function MysuruIntro() {
  return (
    <section className="mysuru" aria-labelledby="mysuru-heading">
      {/* Image column */}
      <div className="mysuru__visual">
        <div className="mysuru__img-main">
          <img
            src={PALACE_IMG}
            alt="Mysuru Palace — a grand heritage building in Karnataka"
            loading="lazy"
            decoding="async"
            onError={(e) => { e.currentTarget.style.opacity = '0'; }}
          />
        </div>
        {/* Decorative accent block */}
        <div className="mysuru__img-accent" aria-hidden="true">
          <span className="mysuru__img-accent-text">Mysuru</span>
          <span className="mysuru__img-accent-sub">Karnataka, India</span>
        </div>
      </div>

      {/* Text column */}
      <div className="mysuru__text">
        <span className="section-label">THE CITY</span>
        <h2 id="mysuru-heading" className="mysuru__heading">
          Mysuru has a rhythm of its own.
        </h2>
        <div className="gold-divider" />
        <p className="mysuru__body">
          From grand heritage buildings and palace grounds to quiet neighbourhoods,
          local markets and the hills overlooking the city, Mysuru is a place worth
          taking your time to explore.
        </p>

        <ul className="mysuru__highlights" aria-label="Places to see in Mysuru">
          {highlights.map((h) => (
            <li key={h.place} className="mysuru__highlight-item">
              <span className="mysuru__highlight-place">{h.place}</span>
              <span className="mysuru__highlight-note">{h.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

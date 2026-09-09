import './ExploreMysuru.css';

/*
 * Image sources (all free/open licences):
 * Palace      — Wikimedia CC BY-SA 4.0, Gana P Nambiar
 * Chamundi    — Pexels free licence
 * Devaraja    — Wikimedia CC BY 2.0, Paul Arps
 * Philomena's — Wikimedia CC BY-SA 4.0, Shashank Mehendale
 * Zoo         — Unsplash free licence
 */

const destinations = [
  {
    id: 'palace',
    name: 'Mysuru Palace',
    category: 'Heritage & architecture',
    img: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Exterior_of_the_Mysore_Palace%2C_Mysore%2C_Karnataka%2C_2018.jpg',
    imgAlt: 'Mysuru Palace — full exterior view showing the main façade, domes and palace grounds',
    objectPos: 'center center',
    accent: '#2D5A3C',
    featured: true,
  },
  {
    id: 'chamundi',
    name: 'Chamundi Hills',
    category: 'Views over the city',
    img: 'https://i.pinimg.com/1200x/25/80/75/2580753a39ba847a2421fc72650508e4.jpg?auto=compress&cs=tinysrgb&w=1400',
    imgAlt: 'Chamundeshwari Temple on Chamundi Hills, Mysuru — ornate gopuram tower against the sky',
    objectPos: 'center top',
    accent: '#B38B4D',
    featured: false,
  },
  {
    id: 'devaraja',
    name: 'Devaraja Market',
    category: 'Local life & colour',
    img: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Devaraja_market_in_Mysore_%28Karnataka%2C_India_2023%29_%2852717164759%29.jpg',
    imgAlt: 'Devaraja Market, Mysuru — historic market building façade with vendors and street activity',
    objectPos: 'center center',
    accent: '#B84A4A',
    featured: false,
  },
  {
    id: 'philomena',
    name: "St. Philomena's Church",
    category: 'Architecture & heritage',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Beautiful_Exterior_view_of_St._Philomena%E2%80%99s_Cathedral%2C_Mysuru%2C_Karnataka.jpg/960px-Beautiful_Exterior_view_of_St._Philomena%E2%80%99s_Cathedral%2C_Mysuru%2C_Karnataka.jpg',
    imgAlt: "St. Philomena's Cathedral, Mysuru — full exterior with twin towers and central façade",
    objectPos: 'center top',
    accent: '#5F665F',
    featured: false,
  },
  {
    id: 'zoo',
    name: 'Mysuru Zoo',
    category: 'A classic city attraction',
    img: 'https://images.unsplash.com/photo-1730621697163-ea65659d59c4?auto=format&fit=crop&fm=jpg&q=85&w=1600',
    imgAlt: 'Asian elephant at Mysuru Zoo surrounded by greenery',
    objectPos: 'center center',
    accent: '#2D5A3C',
    featured: false,
  },
];

export default function ExploreMysuru() {
  return (
    <section className="explore" aria-labelledby="explore-heading">
      {/* Section header */}
      <div className="explore__header container">
        <div>
          <span className="section-label">WHILE YOU'RE HERE</span>
          <h2 id="explore-heading" className="explore__heading">
            Explore Mysuru.
          </h2>
          <div className="gold-divider" />
          <p className="explore__sub">
            Make time for the places, streets and experiences that give the city its character.
          </p>
        </div>
      </div>

      {/* Desktop: Asymmetric grid | Mobile: Horizontal scroll */}
      <div className="explore__scroll-container" role="list" aria-label="Mysuru destinations">
        {/* Desktop asymmetric grid wrapper */}
        <div className="explore__grid">
          {destinations.map((d, i) => (
            <article
              key={d.name}
              className={`explore__card explore__card--${d.id} ${i === 0 ? 'explore__card--featured' : ''} ${!d.img ? 'explore__card--text' : ''}`}
              role="listitem"
              style={{ '--card-accent': d.accent }}
            >
              {d.img ? (
                <>
                  <img
                    src={d.img}
                    alt={d.imgAlt}
                    className="explore__card-img"
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: d.objectPos || 'center center' }}
                    onError={(e) => {
                      e.currentTarget.style.opacity = '0';
                      e.currentTarget.parentElement.classList.add('explore__card--text');
                    }}
                  />
                  <div className="explore__card-overlay" aria-hidden="true" />
                </>
              ) : (
                <div className="explore__card-bg" aria-hidden="true" />
              )}
              <div className="explore__card-body">
                <span className="explore__card-cat">{d.category}</span>
                <h3 className="explore__card-name">{d.name}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

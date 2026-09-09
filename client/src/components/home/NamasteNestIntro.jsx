import { FiMapPin, FiWifi } from 'react-icons/fi';
import { MdOutlineLocalParking } from 'react-icons/md';
import './NamasteNestIntro.css';

const facts = [
  { icon: <FiMapPin size={16} />, label: 'Gokulam, Mysuru' },
  { icon: <FiWifi size={16} />, label: 'Wi-Fi included' },
  { icon: <MdOutlineLocalParking size={16} />, label: 'Free parking' },
  { icon: null, label: 'Up to 8 guests' },
  { icon: null, label: '4 bedrooms · 4 bathrooms' },
  { icon: null, label: 'Direct host contact' },
];

export default function NamasteNestIntro() {
  return (
    <section className="nn-intro" aria-labelledby="nn-heading">
      <div className="nn-intro__inner container">
        {/* Header */}
        <div className="nn-intro__header">
          <span className="section-label">NAMASTE NEST</span>
          <h2 id="nn-heading" className="nn-intro__heading">
            A place to come back to.
          </h2>
          <div className="gold-divider" />
          <p className="nn-intro__body">
            Namaste Nest is a comfortable stay in Gokulam, Mysuru, designed as a convenient
            base for exploring the city, working remotely, visiting family or simply
            slowing down for a few days.
          </p>
        </div>

        {/* Factual info grid */}
        <ul className="nn-intro__facts" aria-label="Stay details">
          {facts.map((f) => (
            <li key={f.label} className="nn-intro__fact">
              {f.icon && <span className="nn-intro__fact-icon" aria-hidden="true">{f.icon}</span>}
              <span className="nn-intro__fact-label">{f.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

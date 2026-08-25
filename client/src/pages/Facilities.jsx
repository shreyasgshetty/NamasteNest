import { FiWifi, FiTv, FiDroplet, FiShield, FiCoffee, FiStar, FiZap } from 'react-icons/fi';
import { MdOutlineLocalParking, MdOutlineCleaningServices, MdOutlineKingBed, MdOutlineAir, MdOutlineLocalLaundryService, MdOutlineRoomService } from 'react-icons/md';
import './Facilities.css';

const CATEGORIES = [
  {
    title: 'Room Amenities',
    icon: <MdOutlineKingBed size={22} />,
    items: [
      { icon: <MdOutlineAir />, name: 'Air Conditioning', desc: 'Individual AC units in every room for your comfort.' },
      { icon: <FiTv />, name: 'Smart TV', desc: 'HD Smart TVs with streaming apps in all room types.' },
      { icon: <FiDroplet />, name: 'Hot Water', desc: '24/7 instant hot water in all bathrooms.' },
      { icon: <FiCoffee />, name: 'Coffee & Tea Maker', desc: 'Freshly brew your morning in 2BHK and larger units.' },
      { icon: <MdOutlineKingBed />, name: 'Premium Bedding', desc: 'High-thread-count linens and plush pillows.' },
      { icon: <FiStar />, name: 'Premium Toiletries', desc: 'Branded toiletries provided in all room types.' },
    ],
  },
  {
    title: 'Connectivity & Tech',
    icon: <FiWifi size={22} />,
    items: [
      { icon: <FiWifi />, name: 'High-Speed WiFi', desc: 'Complimentary fiber-optic WiFi throughout the property.' },
      { icon: <FiZap />, name: 'Power Backup', desc: 'Uninterrupted power supply with full generator backup.' },
      { icon: <FiTv />, name: 'Work Desk', desc: 'Dedicated work desk in 1BHK and larger units.' },
    ],
  },
  {
    title: 'Property Services',
    icon: <MdOutlineCleaningServices size={22} />,
    items: [
      { icon: <MdOutlineCleaningServices />, name: 'Daily Housekeeping', desc: 'Professional housekeeping every day.' },
      { icon: <MdOutlineRoomService />, name: 'Room Service', desc: 'In-room service available during morning and evening hours.' },
      { icon: <MdOutlineLocalLaundryService />, name: 'Laundry Service', desc: 'Same-day laundry available for 3BHK & 4BHK guests. On request for others.' },
      { icon: <FiShield />, name: '24/7 Security', desc: 'Round-the-clock CCTV surveillance and on-site security.' },
      { icon: <MdOutlineLocalParking />, name: 'Free Parking', desc: 'Secure, covered parking for all guests.' },
    ],
  },
];

const COMPARISONS = [
  { feature: 'Air Conditioning', studio: true,  bhk1: true,  bhk2: true,  bhk3: true,  bhk4: true  },
  { feature: 'Free WiFi',        studio: true,  bhk1: true,  bhk2: true,  bhk3: true,  bhk4: true  },
  { feature: 'Hot Water',        studio: true,  bhk1: true,  bhk2: true,  bhk3: true,  bhk4: true  },
  { feature: 'Smart TV',         studio: true,  bhk1: true,  bhk2: true,  bhk3: true,  bhk4: true  },
  { feature: 'Coffee Maker',     studio: false, bhk1: false, bhk2: true,  bhk3: true,  bhk4: true  },
  { feature: 'Full Kitchen',     studio: false, bhk1: true,  bhk2: true,  bhk3: true,  bhk4: true  },
  { feature: 'Balcony/Terrace',  studio: false, bhk1: false, bhk2: true,  bhk3: true,  bhk4: true  },
  { feature: 'Washing Machine',  studio: false, bhk1: false, bhk2: true,  bhk3: true,  bhk4: true  },
  { feature: 'Room Service',     studio: true,  bhk1: true,  bhk2: true,  bhk3: true,  bhk4: true  },
  { feature: 'Free Parking',     studio: true,  bhk1: true,  bhk2: true,  bhk3: true,  bhk4: true  },
  { feature: 'Daily Housekeeping', studio: true, bhk1: true, bhk2: true,  bhk3: true,  bhk4: true  },
];

const Tick = () => <span className="fac__tick">✓</span>;
const Cross = () => <span className="fac__cross">–</span>;

export default function Facilities() {
  return (
    <div className="facilities">
      <div className="facilities__hero">
        <div className="facilities__hero-overlay" />
        <div className="container facilities__hero-content">
          <p className="section-label">What We Offer</p>
          <h1 className="section-title">World-Class Facilities</h1>
          <p className="section-sub">Every detail has been thoughtfully curated for your comfort and convenience.</p>
        </div>
      </div>

      <div className="container">
        {CATEGORIES.map(cat => (
          <section key={cat.title} className="fac__category">
            <div className="fac__category-header">
              <div className="fac__category-icon">{cat.icon}</div>
              <h2>{cat.title}</h2>
            </div>
            <div className="gold-divider" />
            <div className="fac__grid">
              {cat.items.map(item => (
                <div key={item.name} className="fac__item">
                  <div className="fac__item-icon">{item.icon}</div>
                  <div>
                    <h4>{item.name}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Room Comparison Table */}
        <section className="fac__comparison">
          <p className="section-label">Compare</p>
          <h2 className="section-title">Room-by-Room Comparison</h2>
          <div className="gold-divider" />
          <div className="fac__table-wrap">
            <table className="fac__table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Studio</th>
                  <th>1BHK</th>
                  <th>2BHK</th>
                  <th>3BHK</th>
                  <th>4BHK</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISONS.map(row => (
                  <tr key={row.feature}>
                    <td>{row.feature}</td>
                    <td>{row.studio ? <Tick /> : <Cross />}</td>
                    <td>{row.bhk1  ? <Tick /> : <Cross />}</td>
                    <td>{row.bhk2  ? <Tick /> : <Cross />}</td>
                    <td>{row.bhk3  ? <Tick /> : <Cross />}</td>
                    <td>{row.bhk4  ? <Tick /> : <Cross />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

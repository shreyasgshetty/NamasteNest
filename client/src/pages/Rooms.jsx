import { useEffect, useState } from 'react';
import { FiFilter, FiSearch } from 'react-icons/fi';
import RoomCard from '../components/RoomCard';
import axios from 'axios';
import './Rooms.css';

const API = import.meta.env.VITE_API_URL;
const TYPES = ['All', 'Studio', '1BHK', '2BHK', '3BHK', '4BHK'];

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeType, setActiveType] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/properties`)
      .then(r => { setRooms(r.data.data || []); setFiltered(r.data.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = rooms;
    if (activeType !== 'All') result = result.filter(r => r.type === activeType);
    if (search.trim()) result = result.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [activeType, search, rooms]);

  return (
    <div className="rooms-page">
      <div className="rooms-page__hero">
        <div className="rooms-page__hero-overlay" />
        <div className="container rooms-page__hero-content">
          <p className="section-label">Our Accommodations</p>
          <h1 className="section-title">Find Your Perfect Room</h1>
          <p className="section-sub">From intimate studios to spacious suites — crafted for every kind of traveler.</p>
        </div>
      </div>

      <div className="container">
        {/* Filters */}
        <div className="rooms-page__controls">
          <div className="rooms-page__search">
            <FiSearch size={16} />
            <input placeholder="Search rooms..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="rooms-page__filters">
            <FiFilter size={14} />
            {TYPES.map(t => (
              <button key={t} className={`rooms-page__filter-btn ${activeType === t ? 'active' : ''}`} onClick={() => setActiveType(t)}>{t}</button>
            ))}
          </div>
        </div>

        {loading
          ? <div className="rooms-page__grid">{[1,2,3,4,5].map(i => <div key={i} className="skeleton-card" style={{height:'440px'}} />)}</div>
          : filtered.length === 0
            ? <div className="rooms-page__empty"><p>No rooms found. Try a different filter.</p></div>
            : <div className="rooms-page__grid">{filtered.map(r => <RoomCard key={r._id} room={r} />)}</div>
        }
      </div>
    </div>
  );
}

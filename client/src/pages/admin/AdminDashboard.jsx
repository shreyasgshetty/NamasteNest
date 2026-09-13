import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiPlus, FiEdit2, FiTrash2, FiLogOut, FiHome, FiEye } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { resolveImageUrl } from '../../utils/imageUrl';
import logoImg from '../../assets/logo.png';
import './AdminDashboard.css';

const API = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const { user, logout, getToken } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProps = async () => {
    try {
      const { data } = await axios.get(`${API}/properties`);
      setProperties(data.data || []);
    } catch { toast.error('Failed to load properties'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProps(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const token = await getToken();
      await axios.delete(`${API}/properties/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Property deleted');
      fetchProps();
    } catch { toast.error('Failed to delete property'); }
  };

  const handleLogout = async () => { await logout(); navigate('/admin/login'); };

  return (
    <div className="adash">
      {/* Sidebar */}
      <aside className="adash__sidebar">
        <div className="adash__logo">
          <img src={logoImg} alt="Namaste Nest" className="adash__logo-img" />
          <span>Namaste Nest</span>
        </div>
        <nav className="adash__nav">
          <span className="adash__nav-item adash__nav-item--active"><FiHome /> Properties</span>
        </nav>
        <div className="adash__user">
          <img src={user?.photoURL || ''} alt="" className="adash__avatar" />
          <div>
            <p className="adash__uname">{user?.displayName}</p>
            <p className="adash__uemail">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="adash__logout" title="Logout"><FiLogOut /></button>
        </div>
      </aside>

      {/* Main */}
      <main className="adash__main">
        <div className="adash__header">
          <div>
            <h1>Properties</h1>
            <p>{properties.length} total listings</p>
          </div>
          <Link to="/admin/properties/new" className="btn-primary"><FiPlus /> Add Property</Link>
        </div>

        {loading ? (
          <div className="adash__loading">Loading...</div>
        ) : properties.length === 0 ? (
          <div className="adash__empty">
            <p>No properties yet.</p>
            <Link to="/admin/properties/new" className="btn-primary"><FiPlus /> Add Your First Property</Link>
          </div>
        ) : (
          <div className="adash__grid">
            {properties.map(p => (
              <div key={p._id} className="adash__card">
                <div className="adash__card-img">
                  {p.images?.[0]
                    ? <img src={resolveImageUrl(p.images[0])} alt={p.name} />
                    : <div className="adash__card-placeholder">🏡</div>}
                  <span className={`adash__badge ${p.isAvailable ? 'green' : 'red'}`}>
                    {p.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                  {p.isFeatured && <span className="adash__featured">⭐ Featured</span>}
                </div>
                <div className="adash__card-body">
                  <div className="adash__card-type">{p.type}</div>
                  <h3>{p.name}</h3>
                  <p className="adash__card-addr">{p.location?.address || 'No address set'}</p>
                  <p className="adash__card-price">Rates on Enquiry</p>
                  <p className="adash__card-amenities">{p.amenities?.length || 0} amenities · {p.images?.length || 0} photos</p>
                </div>
                <div className="adash__card-actions">
                  <a href={`/rooms/${p.slug}`} target="_blank" rel="noopener noreferrer" className="adash__action-btn" title="View public page"><FiEye /></a>
                  <Link to={`/admin/properties/edit/${p._id}`} className="adash__action-btn adash__action-btn--edit" title="Edit"><FiEdit2 /></Link>
                  <button onClick={() => handleDelete(p._id, p.name)} className="adash__action-btn adash__action-btn--del" title="Delete"><FiTrash2 /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

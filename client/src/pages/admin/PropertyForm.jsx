import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiArrowLeft, FiUpload, FiX, FiCheck } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { resolveImageUrl } from '../../utils/imageUrl';
import logoImg from '../../assets/logo.png';
import './PropertyForm.css';

const API = import.meta.env.VITE_API_URL;

const ALL_AMENITIES = [
  'Free WiFi', 'AC', 'Hot Water', 'TV', 'Smart TV', 'Work Desk', 'Wardrobe',
  'Kitchenette', 'Full Kitchen', 'Refrigerator', 'Mini Bar', 'Coffee Maker',
  'Microwave', 'Balcony', 'Private Terrace', 'Garden Access', 'Private Garden',
  'Bathtub', 'Shower', 'Premium Toiletries', 'Hair Dryer', 'Iron & Board',
  'Free Parking', 'Covered Parking', 'Room Service', 'Daily Housekeeping',
  'Laundry Service', 'Washing Machine', '24/7 Reception', '24/7 Security',
  'CCTV', 'Power Backup', 'Lift/Elevator', 'Wheelchair Accessible',
  'Kids Play Area', 'Dining Table', 'Sitting Lounge', 'Living Room',
  'Swimming Pool', 'Gym', 'Rooftop Access', 'Pet Friendly',
];

const TYPES = ['Studio', '1BHK', '2BHK', '3BHK', '4BHK'];

const empty = {
  name: '', type: 'Studio', description: '', shortDesc: '', price: '',
  capacity: 2, size: '', bedrooms: 1, bathrooms: 1, floor: '',
  amenities: [], highlights: '',
  isFeatured: false, isAvailable: true,
  location: { address: '', landmark: '', city: 'Mysore', state: 'Karnataka', pincode: '', lat: '', lng: '', googleMapsUrl: '', googleMapsLink: '' },
  reviews: { googleBusinessUrl: '', airbnbUrl: '', googleRating: '', googleReviewCount: '' },
};

export default function PropertyForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [form, setForm] = useState(empty);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [saving, setSaving] = useState(false);

  // Convert any null values from MongoDB to '' so controlled inputs never get null
  const nullToStr = (obj) => Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === null || v === undefined ? '' : v])
  );

  useEffect(() => {
    if (isEdit) {
      axios.get(`${API}/properties`).then(r => {
        const prop = r.data.data?.find(p => p._id === id);
        if (prop) {
          setForm({
            name: prop.name || '', type: prop.type || 'Standard',
            description: prop.description || '', shortDesc: prop.shortDesc || '',
            price: prop.price ?? '', capacity: prop.capacity ?? 2,
            size: prop.size || '', bedrooms: prop.bedrooms ?? 1,
            bathrooms: prop.bathrooms ?? 1, floor: prop.floor ?? '',
            amenities: prop.amenities || [], highlights: prop.highlights?.join('\n') || '',
            isFeatured: prop.isFeatured || false, isAvailable: prop.isAvailable ?? true,
            location: { ...empty.location, ...nullToStr(prop.location || {}) },
            reviews: { ...empty.reviews, ...nullToStr(prop.reviews || {}) },
          });
          setExistingImages(prop.images || []);
        }
      });
    }
  }, [id, isEdit]);

  const set = (field, val) => setForm(p => ({ ...p, [field]: val }));
  const setLoc = (field, val) => setForm(p => ({ ...p, location: { ...p.location, [field]: val } }));
  const setRev = (field, val) => setForm(p => ({ ...p, reviews: { ...p.reviews, [field]: val } }));

  const toggleAmenity = (a) => {
    setForm(p => ({
      ...p,
      amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a],
    }));
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles(prev => [...prev, ...files]);
    const urls = files.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...urls]);
  };

  const removeNewFile = (i) => {
    setNewFiles(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const removeExistingImage = async (img) => {
    if (!window.confirm('Remove this image?')) return;
    try {
      const token = await getToken();
      // Extract identifier: public_id for Cloudinary entries, filename for legacy
      let identifier;
      try {
        const parsed = JSON.parse(img);
        identifier = parsed.public_id || img;
      } catch {
        identifier = img;
      }
      await axios.delete(`${API}/properties/${id}/images/${encodeURIComponent(identifier)}`, { headers: { Authorization: `Bearer ${token}` } });
      setExistingImages(prev => prev.filter(i => i !== img));
      toast.success('Image removed');
    } catch { toast.error('Failed to remove image'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price) {
      toast.error('Name, description and price are required'); return;
    }
    setSaving(true);
    try {
      const token = await getToken();
      const fd = new FormData();
      const payload = {
        ...form,
        highlights: form.highlights.split('\n').map(h => h.trim()).filter(Boolean),
        price: Number(form.price),
        capacity: Number(form.capacity),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        floor: form.floor ? Number(form.floor) : undefined,
      };
      fd.append('data', JSON.stringify(payload));
      newFiles.forEach(f => fd.append('images', f));

      // Do NOT manually set Content-Type — axios sets it automatically with
      // the correct multipart boundary when given a FormData object.
      const headers = { Authorization: `Bearer ${token}` };
      if (isEdit) {
        await axios.put(`${API}/properties/${id}`, fd, { headers });
        toast.success('Property updated!');
      } else {
        await axios.post(`${API}/properties`, fd, { headers });
        toast.success('Property created!');
      }
      navigate('/admin');
    } catch (err) {
      console.error('Property save error:', err.response?.data || err);
      toast.error(err.response?.data?.message || err.message || 'Save failed');
    } finally { setSaving(false); }
  };

  return (
    <div className="pform">
      <div className="pform__sidebar">
        <Link to="/admin" className="pform__back"><FiArrowLeft /> Dashboard</Link>
        <div className="pform__logo">
          <img src={logoImg} alt="Namaste Nest" className="pform__logo-img" />
          <span>Namaste Nest</span>
        </div>
        <p className="pform__sidebar-title">{isEdit ? 'Edit Property' : 'Add New Property'}</p>
        <nav className="pform__nav">
          {['Basic Info', 'Images', 'Amenities', 'Location', 'Reviews & Links'].map((s, i) => (
            <a key={s} href={`#section-${i}`} className="pform__nav-link">{s}</a>
          ))}
        </nav>
      </div>

      <form className="pform__main" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="pform__topbar">
          <h1>{isEdit ? 'Edit Property' : 'Add New Property'}</h1>
          <button type="submit" className="btn-primary" disabled={saving}>
            <FiCheck /> {saving ? 'Saving...' : 'Save Property'}
          </button>
        </div>

        {/* ── BASIC INFO ── */}
        <section className="pform__section" id="section-0">
          <h2 className="pform__section-title">Basic Info</h2>
          <div className="pform__row">
            <div className="pform__field pform__field--2">
              <label>Property Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Cozy Studio Suite" required />
            </div>
            <div className="pform__field">
              <label>Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="pform__field">
            <label>Short Description (shown on cards)</label>
            <input value={form.shortDesc} onChange={e => set('shortDesc', e.target.value)} placeholder="One-liner summary" />
          </div>
          <div className="pform__field">
            <label>Full Description *</label>
            <textarea rows={5} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Detailed description of the property..." required />
          </div>
          <div className="pform__row">
            <div className="pform__field">
              <label>Price per Night (₹) *</label>
              <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="1500" required />
            </div>
            <div className="pform__field">
              <label>Max Guests</label>
              <input type="number" value={form.capacity} onChange={e => set('capacity', e.target.value)} min={1} />
            </div>
            <div className="pform__field">
              <label>Size (e.g. 350 sq ft)</label>
              <input value={form.size} onChange={e => set('size', e.target.value)} placeholder="350 sq ft" />
            </div>
          </div>
          <div className="pform__row">
            <div className="pform__field">
              <label>Bedrooms</label>
              <input type="number" value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} min={0} />
            </div>
            <div className="pform__field">
              <label>Bathrooms</label>
              <input type="number" value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} min={1} />
            </div>
            <div className="pform__field">
              <label>Floor</label>
              <input type="number" value={form.floor} onChange={e => set('floor', e.target.value)} placeholder="1" />
            </div>
          </div>
          <div className="pform__field">
            <label>Highlights (one per line)</label>
            <textarea rows={3} value={form.highlights} onChange={e => set('highlights', e.target.value)} placeholder="Chamundi Hills view&#10;Private terrace&#10;Heritage decor" />
          </div>
          <div className="pform__row pform__row--toggles">
            <label className="pform__toggle">
              <input type="checkbox" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} />
              <span>⭐ Featured on homepage</span>
            </label>
            <label className="pform__toggle">
              <input type="checkbox" checked={form.isAvailable} onChange={e => set('isAvailable', e.target.checked)} />
              <span>✅ Currently available</span>
            </label>
          </div>
        </section>

        {/* ── IMAGES ── */}
        <section className="pform__section" id="section-1">
          <h2 className="pform__section-title">Property Images</h2>
          {existingImages.length > 0 && (
            <div className="pform__img-grid">
              {existingImages.map(img => (
                <div key={img} className="pform__img-item">
                  <img src={resolveImageUrl(img)} alt="" />
                  <button type="button" onClick={() => removeExistingImage(img)} className="pform__img-del"><FiX /></button>
                </div>
              ))}
            </div>
          )}
          {previews.length > 0 && (
            <div className="pform__img-grid">
              {previews.map((url, i) => (
                <div key={i} className="pform__img-item pform__img-item--new">
                  <img src={url} alt="" />
                  <button type="button" onClick={() => removeNewFile(i)} className="pform__img-del"><FiX /></button>
                  <span className="pform__img-new-badge">New</span>
                </div>
              ))}
            </div>
          )}
          <label className="pform__upload-btn">
            <FiUpload /> Upload Photos
            <input type="file" multiple accept="image/*" onChange={handleFiles} style={{ display: 'none' }} />
          </label>
          <p className="pform__hint">Upload real property photos. Max 10MB each. JPG, PNG, WebP supported.</p>
        </section>

        {/* ── AMENITIES ── */}
        <section className="pform__section" id="section-2">
          <h2 className="pform__section-title">Amenities <span className="pform__count">({form.amenities.length} selected)</span></h2>
          <div className="pform__amenities-grid">
            {ALL_AMENITIES.map(a => (
              <label key={a} className={`pform__amenity ${form.amenities.includes(a) ? 'pform__amenity--on' : ''}`}>
                <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} style={{ display: 'none' }} />
                {form.amenities.includes(a) ? <FiCheck size={12} /> : null} {a}
              </label>
            ))}
          </div>
        </section>

        {/* ── LOCATION ── */}
        <section className="pform__section" id="section-3">
          <h2 className="pform__section-title">Location & Address</h2>
          <div className="pform__field">
            <label>Full Address</label>
            <input value={form.location.address} onChange={e => setLoc('address', e.target.value)} placeholder="12, Chamundi Hills Road" />
          </div>
          <div className="pform__row">
            <div className="pform__field">
              <label>Landmark</label>
              <input value={form.location.landmark} onChange={e => setLoc('landmark', e.target.value)} placeholder="Near Mysore Palace" />
            </div>
            <div className="pform__field">
              <label>City</label>
              <input value={form.location.city} onChange={e => setLoc('city', e.target.value)} />
            </div>
            <div className="pform__field">
              <label>Pincode</label>
              <input value={form.location.pincode} onChange={e => setLoc('pincode', e.target.value)} placeholder="570010" />
            </div>
          </div>
          <div className="pform__row">
            <div className="pform__field">
              <label>Latitude</label>
              <input type="number" step="any" value={form.location.lat} onChange={e => setLoc('lat', e.target.value)} placeholder="12.2958" />
            </div>
            <div className="pform__field">
              <label>Longitude</label>
              <input type="number" step="any" value={form.location.lng} onChange={e => setLoc('lng', e.target.value)} placeholder="76.6394" />
            </div>
          </div>
          <div className="pform__field">
            <label>Google Maps Embed URL <span className="pform__hint-inline">(iframe src — from Google Maps → Share → Embed)</span></label>
            <input value={form.location.googleMapsUrl} onChange={e => setLoc('googleMapsUrl', e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." />
          </div>
          <div className="pform__field">
            <label>Google Maps Direct Link <span className="pform__hint-inline">(for "Open in Google Maps" button)</span></label>
            <input value={form.location.googleMapsLink} onChange={e => setLoc('googleMapsLink', e.target.value)} placeholder="https://maps.google.com/?q=..." />
          </div>
        </section>

        {/* ── REVIEWS & LINKS ── */}
        <section className="pform__section" id="section-4">
          <h2 className="pform__section-title">Reviews & External Links</h2>
          <p className="pform__hint" style={{ marginBottom: '20px' }}>Link to real reviews on Google and Airbnb — no fake reviews shown on site.</p>
          <div className="pform__field">
            <label>Google Business Profile URL</label>
            <input value={form.reviews.googleBusinessUrl} onChange={e => setRev('googleBusinessUrl', e.target.value)} placeholder="https://g.page/your-business/review" />
          </div>
          <div className="pform__field">
            <label>Airbnb Listing URL</label>
            <input value={form.reviews.airbnbUrl} onChange={e => setRev('airbnbUrl', e.target.value)} placeholder="https://airbnb.com/rooms/..." />
          </div>
          <div className="pform__row">
            <div className="pform__field">
              <label>Google Rating (e.g. 4.8)</label>
              <input type="number" step="0.1" min="1" max="5" value={form.reviews.googleRating} onChange={e => setRev('googleRating', e.target.value)} placeholder="4.8" />
            </div>
            <div className="pform__field">
              <label>Number of Google Reviews</label>
              <input type="number" value={form.reviews.googleReviewCount} onChange={e => setRev('googleReviewCount', e.target.value)} placeholder="120" />
            </div>
          </div>
        </section>

        <div className="pform__footer">
          <Link to="/admin" className="btn-outline">Cancel</Link>
          <button type="submit" className="btn-primary" disabled={saving}>
            <FiCheck /> {saving ? 'Saving...' : 'Save Property'}
          </button>
        </div>
      </form>
    </div>
  );
}

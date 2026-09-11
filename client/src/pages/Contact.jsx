import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiInstagram, FiFacebook } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Contact.css';

const API = import.meta.env.VITE_API_URL;

const INFO = [
  { icon: <FiPhone />, label: 'Phone', value: '+91 91081 77979', href: 'tel:+919108177979' },
  { icon: <FiMail />, label: 'Email', value: 'namastenestmysore@gmail.com', href: 'mailto:namastenestmysore@gmail.com' },
  { icon: <FiMapPin />, label: 'Address', value: '959, 7th Main, Gokulam 3rd Stage, Mysore, Karnataka 570002', href: null },
];

export default function Contact() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);

  // Prefill message when arriving from "Enquire About This Stay" links
  useEffect(() => {
    const stay = searchParams.get('stay');
    if (stay) {
      let decodedStay = stay;
      try {
        decodedStay = decodeURIComponent(stay);
      } catch {
        decodedStay = stay;
      }
      setForm(p => ({
        ...p,
        message: p.message ? p.message : `I'm interested in: ${decodedStay}\n\n`,
      }));
    }
  }, [searchParams]);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSending(true);
    try {
      await axios.post(`${API}/contact`, form);
      toast.success('Message sent! We\'ll get back to you soon. 🙏');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      toast.error('Something went wrong. Please try calling us directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact">
      {/* Hero */}
      <div className="contact__hero">
        <div className="contact__hero-overlay" />
        <div className="container contact__hero-content">
          <p className="section-label">Get In Touch</p>
          <h1 className="section-title">We'd Love to Host You</h1>
          <p className="section-sub">Reach out for availability, enquiries, or just to say Namaste!</p>
        </div>
      </div>

      <div className="container contact__body">
        {/* Info Cards */}
        <div className="contact__info-grid">
          {INFO.map(i => (
            <div key={i.label} className="contact__info-card">
              <div className="contact__info-icon">{i.icon}</div>
              <div>
                <span className="contact__info-label">{i.label}</span>
                {i.href
                  ? <a href={i.href} className="contact__info-val">{i.value}</a>
                  : <p className="contact__info-val">{i.value}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="contact__main">
          {/* Form */}
          <div className="contact__form-wrap">
            <h2>Send Us a Message</h2>
            <div className="gold-divider" />
            <form className="contact__form" onSubmit={handleSubmit} noValidate>
              <div className="contact__form-row">
                <div className="contact__field">
                  <label htmlFor="name">Full Name *</label>
                  <input id="name" name="name" type="text" placeholder="Your name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="contact__field">
                  <label htmlFor="email">Email Address </label>
                  <input id="email" name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handleChange} />
                </div>
              </div>
              <div className="contact__field">
                <label htmlFor="phone">Phone Number *</label>
                <input id="phone" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} required />
              </div>
              <div className="contact__field">
                <label htmlFor="message">Your Message *</label>
                <textarea id="message" name="message" rows={5} placeholder="Tell us about your stay requirements, preferred dates, room type..." value={form.message} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn-primary contact__submit" disabled={sending}>
                {sending ? 'Sending...' : <><FiSend /> Send Message</>}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="contact__sidebar">
            <div className="contact__quick">
              <h3>Quick Contact</h3>
              <div className="gold-divider" />
              <p>Prefer to talk? Call us directly and our team will assist you right away.</p>
              <a href="tel:+919108177979" className="contact__call-btn">
                <FiPhone /> +91 91081 77979
              </a>
              <a href="https://wa.me/919108177979" target="_blank" rel="noopener noreferrer" className="contact__wa-btn">
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

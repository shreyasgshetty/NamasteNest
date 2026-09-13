import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiSend,
  FiArrowRight,
  FiMessageCircle,
} from 'react-icons/fi';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import './Contact.css';

/* ── EmailJS Configuration (set values in client/.env) ── */
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const PHONE_DISPLAY  = '+91 91081 77979';
const PHONE_TEL      = 'tel:+919108177979';
const EMAIL_ADDRESS  = 'namastenestmysore@gmail.com';
const WHATSAPP_URL   = 'https://wa.me/919108177979';

export default function Contact() {
  const [searchParams] = useSearchParams();
  const formRef = useRef(null);

  const [form, setForm]       = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);

  /* Prefill message when arriving from ?stay= links */
  useEffect(() => {
    const stay = searchParams.get('stay');
    if (stay) {
      let decodedStay = stay;
      try { decodedStay = decodeURIComponent(stay); } catch { decodedStay = stay; }
      setForm(p => ({
        ...p,
        message: p.message ? p.message : `I'm interested in: ${decodedStay}\n\n`,
      }));
    }
  }, [searchParams]);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Please enter your name.');
      return;
    }
    if (!form.email.trim()) {
      toast.error('Please enter your email so we can reply to you.');
      return;
    }
    if (!form.phone.trim()) {
      toast.error('Please enter your phone number.');
      return;
    }
    if (!form.message.trim()) {
      toast.error('Please write a message.');
      return;
    }

    setSending(true);
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      toast.success("Message sent! We'll get back to you soon. 🙏");
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      if (import.meta.env.DEV) console.error('[EmailJS]', err);
      toast.error('Something went wrong. Please try calling us directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">

      {/* ── 1. EDITORIAL HERO ── */}
      <header className="contact-hero" aria-label="Contact page hero">
        <div className="contact-hero__overlay" />
        <div className="container contact-hero__inner">
          <span className="section-label">GET IN TOUCH</span>
          <h1 className="contact-hero__title">We'd Love to Host You</h1>
          <p className="contact-hero__sub">
            Whether you're planning a stay or simply have a question, we're here to help.
          </p>
        </div>
      </header>

      {/* ── 2. MAIN CONTACT AREA ── */}
      <main className="container contact-body">
        <div className="contact-grid">

          {/* LEFT — Form */}
          <section className="contact-form-col" aria-labelledby="form-heading">
            <div className="contact-form-head">
              <h2 id="form-heading" className="contact-form-head__title">Tell us about your stay</h2>
              <div className="gold-divider" />
              <p className="contact-form-head__sub">Share a few details and we'll get back to you.</p>
            </div>

            <form
              ref={formRef}
              className="contact-form"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Name + Email row */}
              <div className="contact-form__row">
                <div className="contact-form__field">
                  <label htmlFor="cf-name" className="contact-form__label">
                    Full Name <span className="contact-form__req" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="cf-name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    className="contact-form__input"
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="contact-form__field">
                  <label htmlFor="cf-email" className="contact-form__label">
                    Email Address <span className="contact-form__req" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="cf-email"
                    name="email"
                    type="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={handleChange}
                    className="contact-form__input"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="contact-form__field">
                <label htmlFor="cf-phone" className="contact-form__label">
                  Phone Number <span className="contact-form__req" aria-hidden="true">*</span>
                </label>
                <input
                  id="cf-phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phone}
                  onChange={handleChange}
                  className="contact-form__input"
                  required
                  autoComplete="tel"
                />
              </div>

              {/* Message */}
              <div className="contact-form__field">
                <label htmlFor="cf-message" className="contact-form__label">
                  Your Message <span className="contact-form__req" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="cf-message"
                  name="message"
                  rows={6}
                  placeholder="Tell us about your requirements, preferred dates, or any questions you have…"
                  value={form.message}
                  onChange={handleChange}
                  className="contact-form__input contact-form__textarea"
                  required
                />
              </div>

              <button
                type="submit"
                className="contact-form__submit"
                disabled={sending}
                aria-live="polite"
              >
                {sending
                  ? <span>Sending…</span>
                  : <><FiSend aria-hidden="true" /> Send Message</>
                }
              </button>
            </form>
          </section>

          {/* RIGHT — Contact information panel */}
          <aside className="contact-info-col" aria-label="Contact information">
            <h3 className="contact-info__heading">Let's talk</h3>
            <div className="gold-divider" />
            <p className="contact-info__intro">
              We're a family-run guest house. Reach out and we'll respond personally.
            </p>

            <ul className="contact-info__list" role="list">
              <li className="contact-info__item">
                <span className="contact-info__icon" aria-hidden="true"><FiPhone /></span>
                <div>
                  <span className="contact-info__label">Phone</span>
                  <a href={PHONE_TEL} className="contact-info__value contact-info__link">
                    {PHONE_DISPLAY}
                  </a>
                </div>
              </li>

              <li className="contact-info__item">
                <span className="contact-info__icon" aria-hidden="true"><FiMail /></span>
                <div>
                  <span className="contact-info__label">Email</span>
                  <a
                    href={`mailto:${EMAIL_ADDRESS}`}
                    className="contact-info__value contact-info__link"
                  >
                    {EMAIL_ADDRESS}
                  </a>
                </div>
              </li>

              <li className="contact-info__item">
                <span className="contact-info__icon" aria-hidden="true"><FiMapPin /></span>
                <div>
                  <span className="contact-info__label">Address</span>
                  <address className="contact-info__value contact-info__address">
                    959, 7th Main, Gokulam 3rd Stage,<br />Mysore, Karnataka 570002
                  </address>
                </div>
              </li>
            </ul>

            {/* Direct contact actions */}
            <div className="contact-info__actions">
              <p className="contact-info__actions-label">Prefer a quick conversation?</p>
              <a
                href={PHONE_TEL}
                className="contact-info__call-btn"
                aria-label={`Call ${PHONE_DISPLAY}`}
              >
                <FiPhone aria-hidden="true" />
                Call {PHONE_DISPLAY}
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-info__wa-btn"
                aria-label="Open WhatsApp chat with Namaste Nest"
              >
                <FiMessageCircle aria-hidden="true" />
                Chat on WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </main>

      {/* ── 3. CLOSING CTA ── */}
      <section className="contact-closing" aria-label="Explore stays">
        <div className="container contact-closing__inner">
          <span className="section-label">PLANNING A STAY IN MYSURU?</span>
          <p className="contact-closing__text">
            Tell us what you need, and we'll help you find the right stay.
          </p>
          <Link to="/rooms" className="contact-closing__link">
            Explore Our Stays <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

    </div>
  );
}

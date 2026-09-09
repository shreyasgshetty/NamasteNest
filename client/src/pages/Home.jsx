import { useEffect, useState } from 'react';
import axios from 'axios';

import HomeHero from '../components/home/HomeHero';
import MysuruIntro from '../components/home/MysuruIntro';
import NamasteNestIntro from '../components/home/NamasteNestIntro';
import FeaturedStays from '../components/home/FeaturedStays';
import GokulamSection from '../components/home/GokulamSection';
import ExploreMysuru from '../components/home/ExploreMysuru';
import AirbnbReviews from '../components/home/AirbnbReviews';
import HomeFinalCTA from '../components/home/HomeFinalCTA';

import './Home.css';

const API = import.meta.env.VITE_API_URL;

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/properties`)
      .then((r) => {
        const all = r.data.data || [];
        const feat = all.filter((p) => p.isFeatured);
        setFeatured(feat.length > 0 ? feat : all.slice(0, 3));
      })
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* 1 — Hero: introduce the stay and Mysuru */}
      <HomeHero />

      {/* 2 — Mysuru: editorial city introduction */}
      <MysuruIntro />

      {/* 3 — Namaste Nest: restrained property introduction */}
      <NamasteNestIntro />

      {/* 4 — Stays: dynamic property grid from API */}
      <FeaturedStays rooms={featured} loading={loading} />

      {/* 5 — Gokulam: neighbourhood context */}
      <GokulamSection />

      {/* 6 — Explore: destination storytelling */}
      <ExploreMysuru />

      {/* 7 — Airbnb: real guest experience data */}
      <AirbnbReviews />

      {/* 8 — CTA: calm conclusion */}
      <HomeFinalCTA />
    </div>
  );
}

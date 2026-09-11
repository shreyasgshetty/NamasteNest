import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * ScrollToTop Component
 *
 * Centralized, router-level scroll restoration:
 * 1. Automatically scrolls to (0, 0) on new route navigation (PUSH/REPLACE).
 * 2. Does NOT break browser Back/Forward (POP) natural history restoration.
 * 3. Gracefully supports intentional hash anchors (e.g. /#stays or /location#map).
 * 4. Preserves query parameters without resetting scroll if the pathname didn't change.
 */
export default function ScrollToTop() {
  const location = useLocation();
  const navType = useNavigationType();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const isNewPath = prevPathRef.current !== location.pathname;
    prevPathRef.current = location.pathname;

    // 1. If an intentional hash anchor is present, scroll to that element
    if (location.hash) {
      const targetId = location.hash.replace(/^#/, '');
      const scrollToElement = () => {
        const el = document.getElementById(targetId) || document.querySelector(`[name="${targetId}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return true;
        }
        return false;
      };

      if (!scrollToElement()) {
        // Retry after DOM paints in case the target element is still mounting
        const timer = setTimeout(scrollToElement, 80);
        return () => clearTimeout(timer);
      }
      return;
    }

    // 2. If navigating to a new page via standard link click (PUSH or REPLACE)
    if (isNewPath || navType !== 'POP') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [location.pathname, location.hash, navType]);

  return null;
}

import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../utils/imageUrl';
import './RoomCard.css';

const FALLBACK_IMAGES = {
  'Studio': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=80',
  '1BHK':   'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&q=80',
  '2BHK':   'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=700&q=80',
  '3BHK':   'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=700&q=80',
  '4BHK':   'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80',
  'default':'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80',
};

/**
 * RoomCard — used for non-featured / Other Stays grid.
 *
 * Design rules:
 *   • The ENTIRE card is a clickable Link → /rooms/:slug
 *   • No CTA button, no enquiry link, no Airbnb info
 *   • Discovery → detail page → enquiry/contact
 *   • All fields rendered conditionally — no crash if missing
 */
export default function RoomCard({ room }) {
  const img = room.images?.[0]
    ? resolveImageUrl(room.images[0])
    : FALLBACK_IMAGES[room.type] || FALLBACK_IMAGES['default'];

  const desc = room.shortDesc || (room.description || '').slice(0, 95);
  const needsEllipsis = !room.shortDesc && (room.description || '').length > 95;

  return (
    <Link
      to={`/rooms/${room.slug}`}
      className="room-card"
      aria-label={`View ${room.name}${room.type ? `, ${room.type}` : ''}`}
    >
      {/* Image */}
      <div className="room-card__img-wrap">
        <img
          src={img}
          alt={`${room.name} property photo`}
          loading="lazy"
        />
        {room.type && (
          <span className="room-card__badge">{room.type}</span>
        )}
      </div>

      {/* Body */}
      <div className="room-card__body">
        <h3 className="room-card__title">{room.name}</h3>

        {desc && (
          <p className="room-card__desc">
            {desc}{needsEllipsis ? '…' : ''}
          </p>
        )}

        {/* Amenities — max 4 */}
        {room.amenities?.length > 0 && (
          <div className="room-card__amenities" aria-label="Key amenities">
            {room.amenities.slice(0, 4).map(a => (
              <span key={a}>{a}</span>
            ))}
            {room.amenities.length > 4 && (
              <span>+{room.amenities.length - 4}</span>
            )}
          </div>
        )}

        {/* Enquire action row */}
        <div className="room-card__enquire-row">
          <span className="room-card__enquire-label">Enquire for Rates</span>
          <span className="room-card__enquire-arrow" aria-hidden="true">→</span>
        </div>
      </div>
    </Link>
  );
}

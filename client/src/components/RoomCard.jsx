import { Link } from 'react-router-dom';
import { FiUsers, FiMaximize, FiStar, FiArrowRight } from 'react-icons/fi';
import { MdOutlineKingBed } from 'react-icons/md';
import { resolveImageUrl } from '../utils/imageUrl';
import './RoomCard.css';

const FALLBACK_IMAGES = {
  'Studio': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  '1BHK':   'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
  '2BHK':   'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80',
  '3BHK':   'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&q=80',
  '4BHK':   'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
};

export default function RoomCard({ room }) {
  // Use real uploaded image if present, else Unsplash fallback
  const img = room.images?.[0]
    ? resolveImageUrl(room.images[0])
    : FALLBACK_IMAGES[room.type] || FALLBACK_IMAGES['Standard'];

  return (
    <div className="room-card">
      <div className="room-card__img-wrap">
        <img src={img} alt={room.name} loading="lazy" />
        <span className="room-card__badge">{room.type}</span>
        {room.isFeatured && <span className="room-card__featured"><FiStar size={10} /> Featured</span>}
      </div>
      <div className="room-card__body">
        <h3 className="room-card__title">{room.name}</h3>
        <p className="room-card__desc">{room.shortDesc || room.description.slice(0, 90)}...</p>
        <div className="room-card__meta">
          <span><FiUsers size={13} /> {room.capacity} Guests</span>
          {room.size && <span><FiMaximize size={13} /> {room.size}</span>}
          <span><MdOutlineKingBed size={14} /> Floor {room.floor || 1}</span>
        </div>
        <div className="room-card__amenities">
          {room.amenities?.slice(0, 4).map(a => <span key={a}>{a}</span>)}
          {room.amenities?.length > 4 && <span>+{room.amenities.length - 4} more</span>}
        </div>
        <div className="room-card__footer">
          <div className="room-card__price">
            <span className="room-card__price-val">₹{room.price.toLocaleString()}</span>
            <span className="room-card__price-unit"> / night</span>
          </div>
          <Link to={`/rooms/${room.slug}`} className="room-card__btn">
            View Details <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { formatPrice, getPlaceholderImage, truncate } from '../utils/helpers';
import './ItemCard.css';

/**
 * ItemCard — displays an item in the listing grid.
 * Input: item object { _id, title, images, category, pricePerDay, condition, location, owner }
 * Output: clickable card linking to item detail page
 */
export default function ItemCard({ item }) {
  const imgSrc = item.images && item.images.length > 0 ? item.images[0] : getPlaceholderImage(item.category);

  return (
    <Link to={`/items/${item._id}`} className="item-card card" id={`item-${item._id}`}>
      <div className="item-card-image">
        <img src={imgSrc} alt={item.title} loading="lazy" />
        <span className="item-card-category">{item.category}</span>
      </div>
      <div className="card-body">
        <h3 className="item-card-title">{truncate(item.title, 40)}</h3>
        <p className="item-card-desc">{truncate(item.description, 60)}</p>
        <div className="item-card-meta">
          {item.location && (
            <span className="item-card-location">
              <MapPin size={14} />
              {item.location}
            </span>
          )}
          <span className={`item-card-condition badge-${item.condition === 'new' ? 'approved' : 'active'}`}>
            {item.condition}
          </span>
        </div>
        <div className="item-card-footer">
          <div className="item-card-price">
            {formatPrice(item.pricePerDay)}
            <span>/day</span>
          </div>
          {item.owner && (
            <div className="item-card-owner">
              {item.owner.name}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

import { Star } from 'lucide-react';

/**
 * StarRating — renders a row of star icons for a given rating.
 * Input: rating (number 0-5), size (number), showValue (boolean)
 * Output: star rating display
 */
export default function StarRating({ rating = 0, size = 16, showValue = true }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        size={size}
        fill={i < fullStars || (i === fullStars && hasHalf) ? '#FDCB6E' : 'transparent'}
        stroke={i < fullStars || (i === fullStars && hasHalf) ? '#FDCB6E' : '#6C6C8A'}
        strokeWidth={1.5}
      />
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {stars}
      {showValue && (
        <span style={{ marginLeft: '6px', fontSize: '0.85rem', color: '#A0A0C0' }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

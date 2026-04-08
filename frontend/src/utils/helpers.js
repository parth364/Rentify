/**
 * Formats a date string into a readable format.
 * Input: dateString (ISO string)
 * Output: formatted date string (e.g. "Jan 15, 2025")
 */
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats a number as INR currency.
 * Input: amount (number)
 * Output: formatted string (e.g. "₹500/day")
 */
export function formatPrice(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Returns the relative time from now (e.g. "2 hours ago").
 * Input: dateString (ISO string)
 * Output: relative time string
 */
export function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

/**
 * Truncates a string to a max length with ellipsis.
 * Input: str (string), maxLength (number)
 * Output: truncated string
 */
export function truncate(str, maxLength = 100) {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

/**
 * Returns a placeholder image URL for items without images.
 * Input: category (string)
 * Output: placeholder image URL
 */
export function getPlaceholderImage(category) {
  const colors = {
    textbooks: '6C5CE7',
    electronics: '00D2D3',
    bikes: '00B894',
    cameras: 'FDCB6E',
    furniture: 'FF6B6B',
    clothing: 'A29BFE',
    sports: '55EFC4',
    instruments: '74B9FF',
    other: '6C6C8A',
  };
  const color = colors[category] || '6C5CE7';
  return `https://placehold.co/400x300/${color}/ffffff?text=${category || 'Item'}`;
}

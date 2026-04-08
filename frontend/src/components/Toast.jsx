/**
 * Toast notification component.
 * Input: message (string), type ('success' | 'error')
 */
export default function Toast({ message, type = 'success' }) {
  if (!message) return null;

  return (
    <div className={`toast toast-${type}`} role="alert">
      {message}
    </div>
  );
}

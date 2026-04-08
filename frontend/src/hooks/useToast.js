import { useState, useCallback } from 'react';

/**
 * Custom hook for managing toast notifications.
 * Output: { toast, showToast } — toast object and trigger function
 */
export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return { toast, showToast };
}

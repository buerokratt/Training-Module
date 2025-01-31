import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export const useDebouncedFilter = (delay: number = 300) => {
  const [filter, setFilter] = useState('');
  const setDebouncedFilter = useDebouncedCallback(setFilter, delay);

  return {
    filter,
    setFilter: setDebouncedFilter,
  };
};

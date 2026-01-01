import { useState, useEffect } from 'react';

export const useSavedListings = () => {
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mycircle_saved');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse saved listings', e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('mycircle_saved', JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSave = (id: string) => {
    setSavedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isSaved = (id: string) => savedIds.includes(id);

  return { savedIds, toggleSave, isSaved };
};

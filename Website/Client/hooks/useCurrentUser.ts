import { useState, useEffect } from 'react';
import { MOCK_USER } from '../constants';
import { User } from '../types';

export const useCurrentUser = () => {
  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('mycircle_user');
      return saved ? JSON.parse(saved) : MOCK_USER;
    } catch (e) {
      console.error('Failed to parse user data', e);
      return MOCK_USER;
    }
  });

  useEffect(() => {
    localStorage.setItem('mycircle_user', JSON.stringify(user));
  }, [user]);

  const updateAvatar = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setUser(prev => ({ ...prev, avatar: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const updateName = (name: string) => {
      setUser(prev => ({ ...prev, name }));
  };

  const updateProfile = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return { user, updateAvatar, updateName, updateProfile };
};
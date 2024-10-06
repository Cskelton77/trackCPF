import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { getSettings } from '@/api/users/settings';
import { getFood } from './api/food';
import { RecipeIngredient } from './app/recipe/page';
import { SettingsContextInterface, defaultSettings } from './context';
import { DefinedFoodObject } from './interfaces/FoodObject';

export const logout = () => {
  const router = useRouter();
  localStorage.removeItem('uid');
  localStorage.removeItem('email');
  router.push('/');
};

export const useLogin = () => {
  const [uid, setUid] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    if (uid !== 'ERROR') {
      setUid(localStorage.getItem('uid') || 'ERROR');
      setEmail(localStorage.getItem('email') || 'ERROR');
    } else {
      logout();
    }
  }, []);

  return {
    uid,
    email,
  };
};

export const useSettings = async (uid: string) => {
  const [settings, setUserSettings] = useState<SettingsContextInterface>(defaultSettings);

  async function fetchSettings() {
    const settings = await getSettings(uid);
    setUserSettings(settings);
    return settings;
  }

  useEffect(() => {
    if (uid == 'ERROR') {
      logout();
    } else {
      if (uid != '') {
        fetchSettings();
      }
    }
  }, [uid]);

  return { settings, fetchSettings };
};

export default useLogin;

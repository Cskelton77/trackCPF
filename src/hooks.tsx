import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getSettings } from '@/api/users/settings';
import { SettingsContextInterface, defaultSettings } from './context';

export const useLogin = () => {
  const router = useRouter();

  const [uid, setUid] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    if (uid !== 'ERROR') {
      setUid(localStorage.getItem('uid') || 'ERROR');
      setEmail(localStorage.getItem('email') || 'ERROR');
    } else {
      localStorage.removeItem('uid');
      localStorage.removeItem('email');
      router.push('/');
    }
  }, []);

  return {
    uid,
    email,
  };
};

export const useSettings = async (uid: string) => {
  const router = useRouter();

  const [settings, setUserSettings] = useState<SettingsContextInterface>(defaultSettings);

  async function fetchSettings() {
    const settings = await getSettings(uid);
    setUserSettings(settings);
    return settings;
  }

  useEffect(() => {
    if (uid == 'ERROR') {
      localStorage.removeItem('uid');
      localStorage.removeItem('email');
      router.push('/');
    } else {
      if (uid != '') {
        fetchSettings();
      }
    }
  }, [uid]);

  return { settings, fetchSettings };
};

export default useLogin;

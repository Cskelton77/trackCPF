'use client';
import React, { useEffect, useState } from 'react';

import { SettingsContext, SettingsContextInterface, UserContext, defaultSettings } from '@/context';
import { MenuBar, Settings } from '@/components';
import { useLogin } from '@/hooks';

import { PageWrapper, Header } from './tracker/Page.style';
import { useRouter } from 'next/navigation';
import { getSettings } from '@/api/users/settings';

export default function ParentProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { uid, email } = useLogin();
  const [userSettings, setUserSettings] = useState<SettingsContextInterface>(defaultSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('uid');
    localStorage.removeItem('email');
    router.push('/');
  };

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

  return (
    <SettingsContext.Provider value={userSettings}>
      <UserContext.Provider value={uid}>
        <PageWrapper>
          <Header>
            <span onClick={() => setSettingsOpen(true)}>User: {email}</span>
            <button onClick={() => logout()}>Log Out</button>
          </Header>

          {children}
        </PageWrapper>
        <MenuBar />
        <Settings
          title="User Settings"
          isVisible={settingsOpen}
          close={() => setSettingsOpen(false)}
          uid={uid}
        />
      </UserContext.Provider>
    </SettingsContext.Provider>
  );
}

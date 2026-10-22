import { createContext, useContext, useState, type ReactNode } from 'react';
import type { FrequencyBand, ConnectedDevice, GuestNetwork, RouterStatus } from '@/types';
import { initialBands, initialDevices, initialGuest, initialStatus } from '@/data/initialData';
import { fetchRouterStatus, applyFrequencySettings, type RouterAuth } from '@/services/routerApi';

export interface RouterCredentials {
  routerIP: string;
  username: string;
  password: string;
}

interface RouterContextValue {
  bands: FrequencyBand[];
  devices: ConnectedDevice[];
  guest: GuestNetwork;
  status: RouterStatus;
  credentials: RouterCredentials | null;
  token: string | null;
  cookie: string | null;
  setCredentials: (creds: RouterCredentials) => void;
  setAuth: (token: string, cookie: string) => void;
  logout: () => void;
  refreshStatus: () => Promise<void>;
  applyFrequencies: () => Promise<void>;
  updateBand: (id: string, updates: Partial<FrequencyBand>) => void;
  toggleDeviceBlock: (id: string) => void;
  removeDevice: (id: string) => void;
  updateGuest: (updates: Partial<GuestNetwork>) => void;
  toggleGuest: () => void;
}

const RouterContext = createContext<RouterContextValue | undefined>(undefined);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [bands, setBands] = useState<FrequencyBand[]>(initialBands);
  const [devices, setDevices] = useState<ConnectedDevice[]>(initialDevices);
  const [guest, setGuest] = useState<GuestNetwork>(initialGuest);
  const [status, setStatus] = useState<RouterStatus>(initialStatus);
  const [credentials, setCredentialsState] = useState<RouterCredentials | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cookie, setCookie] = useState<string | null>(null);

  const setCredentials = (creds: RouterCredentials) => {
    setCredentialsState(creds);
  };

  const setAuth = (newToken: string, newCookie: string) => {
    setToken(newToken);
    setCookie(newCookie);
  };

  const logout = () => {
    setCredentialsState(null);
    setToken(null);
    setCookie(null);
  };

  const getAuth = (): RouterAuth | null => {
    if (!token) return null;
    return { token, cookie: cookie || '' };
  };

  const refreshStatus = async () => {
    if (!credentials) throw new Error('لا توجد بيانات اعتماد');
    const auth = getAuth();
    if (!auth) throw new Error('لا يوجد رمز مصادقة');
    const realStatus = await fetchRouterStatus(credentials.routerIP, auth);
    setStatus(realStatus);
  };

  const applyFrequencies = async () => {
    if (!credentials) throw new Error('لا توجد بيانات اعتماد');
    const auth = getAuth();
    if (!auth) throw new Error('لا يوجد رمز مصادقة');
    await applyFrequencySettings(credentials.routerIP, auth, bands);
  };

  const updateBand = (id: string, updates: Partial<FrequencyBand>) => {
    setBands((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const toggleDeviceBlock = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isBlocked: !d.isBlocked } : d))
    );
  };

  const removeDevice = (id: string) => {
    setDevices((prev) => {
      const next = prev.filter((d) => d.id !== id);
      setStatus((s) => ({ ...s, connectedDevices: next.length }));
      return next;
    });
  };

  const updateGuest = (updates: Partial<GuestNetwork>) => {
    setGuest((prev) => ({ ...prev, ...updates }));
  };

  const toggleGuest = () => {
    setGuest((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  return (
    <RouterContext.Provider
      value={{
        bands, devices, guest, status, credentials, token, cookie,
        setCredentials, setAuth, logout, refreshStatus, applyFrequencies,
        updateBand, toggleDeviceBlock, removeDevice, updateGuest, toggleGuest,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}

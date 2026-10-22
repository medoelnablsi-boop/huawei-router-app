export type WiFiBand = '2.4GHz' | '5GHz';

export interface FrequencyBand {
  id: string;
  band: WiFiBand;
  channel: number;
  channelWidth: number;
  power: number;
  enabled: boolean;
  ssid: string;
  maxPower: number;
  minPower: number;
  availableChannels: number[];
}

export interface ConnectedDevice {
  id: string;
  name: string;
  mac: string;
  ip: string;
  band: WiFiBand;
  signalStrength: number;
  downloadSpeed: number;
  uploadSpeed: number;
  connectedSince: string;
  dataUsed: number;
  isBlocked: boolean;
  icon: string;
}

export interface GuestNetwork {
  enabled: boolean;
  ssid: string;
  password: string;
  band: WiFiBand | 'dual';
  duration: number;
  maxDevices: number;
  devicesConnected: number;
}

export interface RouterStatus {
  uptime: string;
  cpuUsage: number;
  memoryUsage: number;
  temperature: number;
  totalDownload: number;
  totalUpload: number;
  connectedDevices: number;
}

export type Page = 'dashboard' | 'frequencies' | 'devices' | 'network' | 'guest';

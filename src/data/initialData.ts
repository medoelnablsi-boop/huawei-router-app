import type { FrequencyBand, ConnectedDevice, GuestNetwork, RouterStatus } from '@/types';

export const initialBands: FrequencyBand[] = [
  {
    id: 'band-24',
    band: '2.4GHz',
    channel: 6,
    channelWidth: 20,
    power: 75,
    enabled: true,
    ssid: 'Huawei-Home-2.4G',
    maxPower: 100,
    minPower: 20,
    availableChannels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
  {
    id: 'band-5',
    band: '5GHz',
    channel: 44,
    channelWidth: 80,
    power: 80,
    enabled: true,
    ssid: 'Huawei-Home-5G',
    maxPower: 100,
    minPower: 20,
    availableChannels: [36, 40, 44, 48, 149, 153, 157, 161],
  },
];

export const initialDevices: ConnectedDevice[] = [
  { id: 'd1', name: 'iPhone 15 Pro', mac: 'A4:B5:C6:D7:E8:F9', ip: '192.168.1.10', band: '5GHz', signalStrength: 92, downloadSpeed: 85.4, uploadSpeed: 22.1, connectedSince: 'منذ ساعتين', dataUsed: 1.8, isBlocked: false, icon: 'smartphone' },
  { id: 'd2', name: 'Galaxy S24', mac: 'B1:C2:D3:E4:F5:A6', ip: '192.168.1.11', band: '5GHz', signalStrength: 88, downloadSpeed: 64.2, uploadSpeed: 15.7, connectedSince: 'منذ ساعة', dataUsed: 0.9, isBlocked: false, icon: 'smartphone' },
  { id: 'd3', name: 'MacBook Pro', mac: 'C3:D4:E5:F6:A7:B8', ip: '192.168.1.12', band: '5GHz', signalStrength: 95, downloadSpeed: 120.5, uploadSpeed: 40.3, connectedSince: 'منذ 5 ساعات', dataUsed: 3.2, isBlocked: false, icon: 'laptop' },
  { id: 'd4', name: 'Smart TV LG', mac: 'D5:E6:F7:A8:B9:C0', ip: '192.168.1.13', band: '2.4GHz', signalStrength: 72, downloadSpeed: 45.0, uploadSpeed: 8.2, connectedSince: 'منذ يوم', dataUsed: 5.6, isBlocked: false, icon: 'tv' },
  { id: 'd5', name: 'HP Printer', mac: 'E7:F8:A9:B0:C1:D2', ip: '192.168.1.14', band: '2.4GHz', signalStrength: 60, downloadSpeed: 0.1, uploadSpeed: 0.05, connectedSince: 'منذ 3 أيام', dataUsed: 0.02, isBlocked: false, icon: 'printer' },
  { id: 'd6', name: 'iPad Air', mac: 'F9:A0:B1:C2:D3:E4', ip: '192.168.1.15', band: '5GHz', signalStrength: 85, downloadSpeed: 30.0, uploadSpeed: 12.0, connectedSince: 'منذ 30 دقيقة', dataUsed: 0.3, isBlocked: false, icon: 'tablet' },
  { id: 'd7', name: 'Alexa Echo', mac: 'A2:B3:C4:D5:E6:F7', ip: '192.168.1.16', band: '2.4GHz', signalStrength: 55, downloadSpeed: 2.0, uploadSpeed: 1.0, connectedSince: 'منذ أسبوع', dataUsed: 0.5, isBlocked: false, icon: 'speaker' },
  { id: 'd8', name: 'PlayStation 5', mac: 'B4:C5:D6:E7:F8:A9', ip: '192.168.1.17', band: '5GHz', signalStrength: 90, downloadSpeed: 95.0, uploadSpeed: 30.0, connectedSince: 'منذ ساعتين', dataUsed: 8.0, isBlocked: false, icon: 'gamepad' },
];

export const initialGuest: GuestNetwork = {
  enabled: false,
  ssid: 'Huawei-Guest',
  password: 'Guest@2024',
  band: 'dual',
  duration: 4,
  maxDevices: 10,
  devicesConnected: 0,
};

export const initialStatus: RouterStatus = {
  uptime: '7 أيام، 14 ساعة',
  cpuUsage: 23,
  memoryUsage: 48,
  temperature: 42,
  totalDownload: 156.7,
  totalUpload: 42.3,
  connectedDevices: 8,
};

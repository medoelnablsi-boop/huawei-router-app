import type { FrequencyBand, RouterStatus } from '@/types';

export interface RouterAuth {
  token: string;
  cookie: string;
}

const isCapacitor = typeof window !== 'undefined' && window.location.protocol === 'capacitor:';

function buildApiUrl(routerIP: string, path: string): string {
  if (isCapacitor) {
    return `http://${routerIP}${path}`;
  }
  return path;
}

function parseXml(text: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(text, 'application/xml');
}

function getXmlValue(doc: Document, tagName: string): string {
  const el = doc.querySelector(tagName);
  return el?.textContent?.trim() || '';
}

function checkForError(doc: Document): void {
  const errorEl = doc.querySelector('error');
  if (errorEl) {
    const code = getXmlValue(doc, 'code');
    throw new Error(`خطأ من الراوتر: رمز ${code || 'غير معروف'}`);
  }
}

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('انتهت مهلة الاتصال — تأكد من أن الراوتر يعمل ومتصل');
    }
    throw new Error('تعذّر الاتصال بالراوتر — تحقق من عنوان IP والاتصال بالشبكة');
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchToken(routerIP: string): Promise<RouterAuth> {
  const url = buildApiUrl(routerIP, '/api/webserver/token');
  const response = await fetchWithTimeout(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/xml',
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  if (!response.ok) {
    throw new Error(`فشل الاتصال بالراوتر (${response.status})`);
  }

  const text = await response.text();
  const doc = parseXml(text);
  checkForError(doc);

  const token = getXmlValue(doc, 'token');
  if (!token) {
    throw new Error('لم يتم العثور على رمز المصادقة (Token) في استجابة الراوتر');
  }

  let cookie = '';
  try {
    cookie = response.headers.get('Set-Cookie') || '';
  } catch {
    // Set-Cookie may not be accessible in WebView; credentials:'include' handles it
  }

  return { token, cookie };
}

export async function fetchRouterStatus(routerIP: string, auth: RouterAuth): Promise<RouterStatus> {
  const url = buildApiUrl(routerIP, '/api/monitoring/status');
  const headers: Record<string, string> = {
    'Accept': 'application/xml',
    'X-Requested-With': 'XMLHttpRequest',
    '__RequestVerificationToken': auth.token,
  };
  if (auth.cookie) {
    headers['Cookie'] = auth.cookie;
  }

  const response = await fetchWithTimeout(url, {
    method: 'GET',
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`فشل جلب حالة الراوتر (${response.status})`);
  }

  const text = await response.text();
  const doc = parseXml(text);
  checkForError(doc);

  const downloadRate = parseInt(getXmlValue(doc, 'CurrentDownloadRate') || '0', 10);
  const uploadRate = parseInt(getXmlValue(doc, 'CurrentUploadRate') || '0', 10);
  const connectedDevices = parseInt(getXmlValue(doc, 'CurrentNetworkUser') || '0', 10);
  const cpuUsage = parseInt(getXmlValue(doc, 'cpuUsage') || '0', 10);
  const memoryUsage = parseInt(getXmlValue(doc, 'MemoryUsage') || '0', 10);
  const temperature = parseInt(getXmlValue(doc, 'Temperature') || '0', 10);
  const totalConnectTime = parseInt(getXmlValue(doc, 'TotalConnectTime') || '0', 10);

  return {
    totalDownload: +(downloadRate / 125000).toFixed(1),
    totalUpload: +(uploadRate / 125000).toFixed(1),
    connectedDevices,
    cpuUsage,
    memoryUsage,
    temperature,
    uptime: formatUptime(totalConnectTime),
  };
}

function formatUptime(seconds: number): string {
  if (seconds <= 0) return 'غير متاح';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} يوم`);
  if (hours > 0) parts.push(`${hours} ساعة`);
  if (mins > 0) parts.push(`${mins} دقيقة`);
  return parts.join('، ') || 'أقل من دقيقة';
}

export async function applyFrequencySettings(
  routerIP: string,
  auth: RouterAuth,
  bands: FrequencyBand[]
): Promise<void> {
  const band24 = bands.find((b) => b.band === '2.4GHz');
  const band5 = bands.find((b) => b.band === '5GHz');

  const xmlBody = `<?xml version="1.0" encoding="UTF-8"?>
<request>
  <NetworkMode>03</NetworkMode>
  <NetworkBand>3FFFFFFF</NetworkBand>
  <Wlan24GEnabled>${band24?.enabled ? '1' : '0'}</Wlan24GEnabled>
  <Wlan5GEnabled>${band5?.enabled ? '1' : '0'}</Wlan5GEnabled>
  <Wlan24GChannel>${band24?.channel || 6}</Wlan24GChannel>
  <Wlan5GChannel>${band5?.channel || 44}</Wlan5GChannel>
  <Wlan24GChannelWidth>${band24?.channelWidth || 20}</Wlan24GChannelWidth>
  <Wlan5GChannelWidth>${band5?.channelWidth || 80}</Wlan5GChannelWidth>
  <Wlan24GPower>${band24?.power || 75}</Wlan24GPower>
  <Wlan5GPower>${band5?.power || 80}</Wlan5GPower>
</request>`;

  const url = buildApiUrl(routerIP, '/api/net/net-mode');
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Requested-With': 'XMLHttpRequest',
    '__RequestVerificationToken': auth.token,
  };
  if (auth.cookie) {
    headers['Cookie'] = auth.cookie;
  }

  const response = await fetchWithTimeout(url, {
    method: 'POST',
    headers,
    body: xmlBody,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`فشل تطبيق إعدادات الترددات (${response.status})`);
  }

  const text = await response.text();
  const doc = parseXml(text);
  checkForError(doc);
}

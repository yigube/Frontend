import axios from 'axios';
import Constants from 'expo-constants';
import { getToken } from './tokenStorage';

const API_PORT = '4000';
const HEALTHCHECK_PATH = '/';
const HEALTHCHECK_TIMEOUT_MS = 1500;
const API_URL_CACHE_MS = 15000;
const LOOPBACK_FALLBACK_URLS = [
  `http://localhost:${API_PORT}`,
  `http://127.0.0.1:${API_PORT}`,
];

const parseHostFromValue = (value) => {
  if (!value || typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const withoutProtocol = trimmed.replace(/^https?:\/\//i, '');
  const withoutPath = withoutProtocol.split('/')[0];
  const host = withoutPath.split(':')[0];

  return host || null;
};

const normalizeApiUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  return url.trim().replace(/\/+$/, '');
};

const getEnvApiUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  return envUrl ? normalizeApiUrl(envUrl) : null;
};

const collectRuntimeHosts = () => {
  const hosts = [];

  const pushHost = (value) => {
    const host = parseHostFromValue(value);
    if (host) hosts.push(host);
  };

  pushHost(Constants?.expoConfig?.hostUri);
  pushHost(Constants?.manifest2?.extra?.expoClient?.hostUri);
  pushHost(Constants?.manifest?.debuggerHost);

  if (typeof window !== 'undefined' && window?.location?.hostname) {
    pushHost(window.location.hostname);
  }

  return [...new Set(hosts)];
};

const buildCandidateApiUrls = () => {
  const envUrl = getEnvApiUrl();
  const runtimeUrls = collectRuntimeHosts().map((host) =>
    normalizeApiUrl(`http://${host}:${API_PORT}`),
  );
  const values = [envUrl, ...runtimeUrls, ...LOOPBACK_FALLBACK_URLS.map(normalizeApiUrl)];
  return [...new Set(values.filter(Boolean))];
};

const probeClient = axios.create({
  timeout: HEALTHCHECK_TIMEOUT_MS,
  validateStatus: (status) => status >= 200 && status < 500,
});

const isApiReachable = async (baseUrl) => {
  try {
    await probeClient.get(`${baseUrl}${HEALTHCHECK_PATH}`);
    return true;
  } catch {
    return false;
  }
};

let currentApiUrl = buildCandidateApiUrls()[0] || LOOPBACK_FALLBACK_URLS[0];
let resolvingApiUrlPromise = null;
let lastApiUrlResolvedAt = 0;

export const api = axios.create({ baseURL: currentApiUrl });

export const API_URL = currentApiUrl;

export const getApiBaseUrl = async (forceRefresh = false) => {
  const now = Date.now();
  if (
    !forceRefresh &&
    currentApiUrl &&
    now - lastApiUrlResolvedAt < API_URL_CACHE_MS
  ) {
    return currentApiUrl;
  }

  if (resolvingApiUrlPromise) return resolvingApiUrlPromise;

  resolvingApiUrlPromise = (async () => {
    const candidates = buildCandidateApiUrls();

    for (const candidate of candidates) {
      if (await isApiReachable(candidate)) {
        currentApiUrl = candidate;
        lastApiUrlResolvedAt = Date.now();
        api.defaults.baseURL = candidate;
        return candidate;
      }
    }

    currentApiUrl = candidates[0] || currentApiUrl;
    lastApiUrlResolvedAt = Date.now();
    api.defaults.baseURL = currentApiUrl;
    return currentApiUrl;
  })();

  try {
    return await resolvingApiUrlPromise;
  } finally {
    resolvingApiUrlPromise = null;
  }
};

api.interceptors.request.use(async (config) => {
  config.baseURL = await getApiBaseUrl();
  try {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {}
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;
    const hasResponse = Boolean(error?.response);
    if (!config || hasResponse || config.__apiFailoverRetried) {
      throw error;
    }

    config.__apiFailoverRetried = true;
    config.baseURL = await getApiBaseUrl(true);
    return api.request(config);
  },
);

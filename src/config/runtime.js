import Constants from 'expo-constants';

const parseBool = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return false;
  const v = value.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes' || v === 'on';
};

const extra = Constants?.expoConfig?.extra || {};

export const LOCAL_MODE = parseBool(process.env.EXPO_PUBLIC_LOCAL_MODE) || parseBool(extra.localMode);


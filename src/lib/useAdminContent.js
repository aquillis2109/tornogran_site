import { useEffect, useState } from 'react';
import { getContent, getSettings, listenAdminData, normalizeImageValue } from './adminStore.js';

export function useAdminContent() {
  const [content, setContent] = useState(getContent);

  useEffect(() => {
    return listenAdminData(() => setContent(getContent()));
  }, []);

  return content;
}

export function useAdminSettings() {
  const [settings, setSettings] = useState(getSettings);

  useEffect(() => {
    return listenAdminData(() => setSettings(getSettings()));
  }, []);

  return settings;
}

export function resolveImage(value, fallback) {
  return normalizeImageValue(value) || fallback;
}

export function resolveImageList(value, fallback = []) {
  const images = (Array.isArray(value) ? value : []).map(normalizeImageValue).filter(Boolean);
  return images.length ? images : fallback;
}

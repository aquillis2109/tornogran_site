import { useEffect, useState } from 'react';
import { getContent, listenAdminData, normalizeImageValue } from './adminStore.js';

export function useAdminContent() {
  const [content, setContent] = useState(getContent);

  useEffect(() => {
    return listenAdminData(() => setContent(getContent()));
  }, []);

  return content;
}

export function resolveImage(value, fallback) {
  return normalizeImageValue(value) || fallback;
}

export function resolveImageList(value, fallback = []) {
  const images = (Array.isArray(value) ? value : []).map(normalizeImageValue).filter(Boolean);
  return images.length ? images : fallback;
}

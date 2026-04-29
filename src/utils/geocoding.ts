import { GeocodeCache } from '../types';

const CACHE_KEY = 'ihe_geocode_cache';

export const getCache = (): GeocodeCache => {
  const cache = localStorage.getItem(CACHE_KEY);
  return cache ? JSON.parse(cache) : {};
};

export const saveCache = (cache: GeocodeCache) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};

export const geocodeAddress = async (address: string, district: string): Promise<{ lat: number; lng: number } | null> => {
  const fullAddress = `${address}, ${district}, Istanbul, Turkey`;
  const cache = getCache();

  if (cache[fullAddress]) {
    return cache[fullAddress];
  }

  try {
    // Nominatim API call (Rate limit: 1 request per second)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      const result = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
      cache[fullAddress] = result;
      saveCache(cache);
      return result;
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }

  return null;
};

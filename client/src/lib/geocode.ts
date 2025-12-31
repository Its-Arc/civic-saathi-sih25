/**
 * Demo-safe geocoding helper
 *
 * WHY CORS ERRORS HAPPEN:
 * Nominatim (OpenStreetMap's geocoding API) doesn't allow direct browser requests
 * because their server doesn't send the `Access-Control-Allow-Origin` header.
 * Browsers block these "cross-origin" requests for security.
 *
 * SOLUTION FOR DEMO:
 * We proxy geocoding requests through our backend API at /api/geocode.
 * The backend can make server-to-server requests without CORS restrictions.
 * This is reliable and doesn't depend on third-party CORS proxies.
 *
 * ALTERNATIVE APPROACHES:
 * - Use a paid geocoding API with CORS support (Google Maps, Mapbox)
 * - Pre-geocode locations and store coordinates in the database
 */

// Cache geocoded results to avoid repeated API calls
const geocodeCache = new Map<string, [number, number]>();

/**
 * Geocode a location string to coordinates using our backend proxy.
 * Returns [lat, lng] or null if geocoding fails.
 *
 * @param location Human-readable location string (e.g., "HITEC City, Hyderabad")
 * @returns Promise<[number, number] | null>
 */
export async function geocodeLocation(
  location: string
): Promise<[number, number] | null> {
  const trimmed = location.trim();
  if (!trimmed) return null;

  // Check cache first
  if (geocodeCache.has(trimmed)) {
    return geocodeCache.get(trimmed)!;
  }

  // Check if already coordinates (lat, lng format)
  const coordMatch = trimmed.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lng = parseFloat(coordMatch[2]);
    if (isFinite(lat) && isFinite(lng)) {
      geocodeCache.set(trimmed, [lat, lng]);
      return [lat, lng];
    }
  }

  try {
    // Use our backend API to proxy geocoding requests
    // This avoids CORS issues since the backend makes server-to-server requests
    const response = await fetch(
      `/api/geocode?q=${encodeURIComponent(trimmed)}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      console.warn(`[Geocode] HTTP error for "${trimmed}":`, response.status);
      return null;
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);

      if (isFinite(lat) && isFinite(lng)) {
        geocodeCache.set(trimmed, [lat, lng]);
        return [lat, lng];
      }
    }

    console.warn(`[Geocode] No results for "${trimmed}"`);
    return null;
  } catch (error) {
    // Graceful failure - log and return null
    console.warn(`[Geocode] Failed for "${trimmed}":`, error);
    return null;
  }
}

/**
 * Batch geocode multiple locations with rate limiting.
 * Returns a Map of location string -> coordinates.
 *
 * @param locations Array of location strings
 * @param delayMs Delay between requests (default 400ms to be polite to APIs)
 */
export async function batchGeocode(
  locations: string[],
  delayMs = 400
): Promise<Map<string, [number, number]>> {
  const results = new Map<string, [number, number]>();

  for (const loc of locations) {
    const coords = await geocodeLocation(loc);
    if (coords) {
      results.set(loc, coords);
    }
    // Small delay between requests to avoid overwhelming the API
    if (locations.indexOf(loc) < locations.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

/**
 * Clear the geocode cache (useful for testing)
 */
export function clearGeocodeCache(): void {
  geocodeCache.clear();
}

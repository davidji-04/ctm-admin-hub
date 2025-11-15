import * as turf from '@turf/turf';
import { Locality } from '@/types/locality';

// Average walking speed: 5 km/h on flat terrain
const AVERAGE_WALKING_SPEED_KMH = 5;

/**
 * Calculate distance between two coordinates using Turf.js
 * Returns distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const from = turf.point([lon1, lat1]);
  const to = turf.point([lon2, lat2]);
  const distance = turf.distance(from, to, { units: 'kilometers' });
  return Math.round(distance * 100) / 100; // Round to 2 decimals
};

/**
 * Calculate estimated time based on distance and elevation difference
 * Returns time in minutes
 */
export const calculateEstimatedTime = (
  distanceKm: number,
  elevationDiff?: number
): number => {
  // Base time from distance
  let timeMinutes = (distanceKm / AVERAGE_WALKING_SPEED_KMH) * 60;

  // Add time for elevation gain (approximately 10 minutes per 100m gain)
  if (elevationDiff && elevationDiff > 0) {
    timeMinutes += (elevationDiff / 100) * 10;
  }

  return Math.round(timeMinutes);
};

/**
 * Suggest difficulty level based on distance and elevation
 */
export const suggestDifficulty = (
  distanceKm: number,
  elevationDiff?: number
): 'facil' | 'media' | 'dificil' => {
  const elevationFactor = elevationDiff ? Math.abs(elevationDiff) / 100 : 0;

  if (distanceKm < 15 && elevationFactor < 3) {
    return 'facil';
  } else if (distanceKm <= 25 && elevationFactor < 5) {
    return 'media';
  } else {
    return 'dificil';
  }
};

/**
 * Validate coordinates
 */
export const validateCoordinates = (lat: number, lon: number): boolean => {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
};

/**
 * Validate distance between localities (max 200km)
 */
export const validateLocalityDistance = (distanceKm: number): boolean => {
  return distanceKm <= 200;
};

/**
 * Recalculate distances for all localities in order
 */
export const recalculateAllDistances = (localities: Locality[]): Locality[] => {
  if (localities.length === 0) return [];

  return localities.map((locality, index) => {
    if (index === 0) {
      return {
        ...locality,
        distancia_localidade_anterior: 0,
        tempo_estimado_da_anterior: 0,
      };
    }

    const prev = localities[index - 1];
    const distance = calculateDistance(
      prev.latitude,
      prev.longitude,
      locality.latitude,
      locality.longitude
    );

    const elevationDiff = locality.elevacao_altimetria && prev.elevacao_altimetria
      ? locality.elevacao_altimetria - prev.elevacao_altimetria
      : undefined;

    const time = calculateEstimatedTime(distance, elevationDiff);

    return {
      ...locality,
      distancia_localidade_anterior: distance,
      tempo_estimado_da_anterior: time,
    };
  });
};

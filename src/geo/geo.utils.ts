// export const BOUNDS = {
//   minLat: 47.65,
//   maxLat: 47.80,
//   minLng: 37.45,
//   maxLng: 37.90,
// };

export const random = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export const calcDirection = (
  prevLat: number,
  prevLng: number,
  lat: number,
  lng: number,
): number => {
  const rad = Math.atan2(lng - prevLng, lat - prevLat);
  const deg = (rad * 180) / Math.PI + 180;

  return Math.round(deg);
};

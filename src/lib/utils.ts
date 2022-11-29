const J2000 = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Get degrees in the range of 0 to 360
 */
export function getDegreesInRange(degrees: number): number {
  let d = degrees;
  if (d < 0) {
    d = 360 + (d % 360);
  }
  if (d >= 360) {
    d = d % 360;
  }
  return d;
}

/**
 * Get degrees from radians
 */
export function getRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Get radians from degrees
 */
export function getDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Get the degrees from the hours (e.g. RA)
 */
export function getDegreesFromHours(hours: number): number {
  return hours * 15;
}

/**
 * get the number of days since the J2000 epoch (2000-01-01T12:00:00Z)
 * @see http://www.stargazing.net/kepler/altaz.html
 */
export function getDaysSinceJ2000(date: Date): number {
  const msSinceJ2000 = date.getTime() - J2000.getTime();
  return msSinceJ2000 / MS_PER_DAY;
}

/**
 * Get the local sidereal time at a given longitude
 * returns the sidereal time in degrees between 0 and 360
 * @see http://www.stargazing.net/kepler/altaz.html
 */
export function getLocalSiderealTime({
  date,
  long,
}: {
  date: Date;
  long: number;
}): number {
  const days = getDaysSinceJ2000(date);

  const degrees =
    100.46 +
    0.985647 * days +
    long +
    15 * date.getUTCHours() +
    0.25 * date.getUTCMinutes();

  return getDegreesInRange(degrees);
}

/**
 * Get the hour angle of a celestial body at a given local sidereal time
 */
export function getHourAngle({ lst, ra }: { lst: number; ra: number }): number {
  return getDegreesInRange(lst - ra);
}

/**
 * Get the altitude of a celestial body at a given hour angle and declination
 */
export function getAltitudeDegrees({
  lat,
  dec,
  ha,
}: {
  lat: number;
  dec: number;
  ha: number;
}) {
  const latRad = getRadians(lat);
  const decRad = getRadians(dec);
  const haRad = getRadians(ha);

  const sinAlt =
    Math.sin(latRad) * Math.sin(decRad) +
    Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad);

  const altRad = Math.asin(sinAlt);
  return getDegrees(altRad);
}

/**
 * Get the altitude of a celestial body at a given date and location, given the right ascension and declination
 */
export function getAltitudeDegreesAtDateAndLatitude({
  date,
  lat,
  long,
  dec,
  ra,
}: {
  date: Date;
  lat: number;
  long: number;
  dec: number;
  ra: number;
}) {
  const lst = getLocalSiderealTime({ date, long });
  const ha = getHourAngle({ lst, ra });
  return getAltitudeDegrees({ lat, dec, ha });
}

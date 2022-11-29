import { describe, expect, test } from "vitest";
import {
  getDaysSinceJ2000,
  getLocalSiderealTime,
  getDegreesInRange,
  getDegrees,
  getRadians,
  getAltitudeDegrees,
  getAltitudeDegreesAtDateAndLatitude,
} from "./utils";

// we're rounding because fuck it js is weird with floats
const round = (n: number) => Math.round(n * 1000) / 1000;

describe("getDegreesInRange", () => {
  test("should return original value for 0 - 360", () => {
    const testCases = [
      { input: 0, expected: 0 },
      { input: 1, expected: 1 },
      { input: 202.12, expected: 202.12 },
      { input: 359, expected: 359 },
      { input: 359.999999, expected: 359.999999 },
      { input: 360, expected: 0 },
    ];

    for (const testCase of testCases) {
      const actual = getDegreesInRange(testCase.input);
      expect(actual).toBe(testCase.expected);
    }
  });

  test("should return value between 0 - 360 for negative numbers", () => {
    const testCases = [
      { input: -1, expected: 359 },
      { input: -202.12, expected: 157.88 },
      { input: -359, expected: 1 },
      { input: -359.9, expected: 0.1 },
      { input: -360, expected: 0 },
    ];

    for (const testCase of testCases) {
      const actual = getDegreesInRange(testCase.input);
      expect(round(actual)).toBe(testCase.expected);
    }
  });

  test("should return value between 0 - 360 for values greater than 360", () => {
    const testCases = [
      { input: 360.1, expected: 0.1 },
      { input: 361, expected: 1 },
      { input: 500, expected: 140 },
      { input: 720, expected: 0 },
      { input: 721, expected: 1 },
      { input: 721.1, expected: 1.1 },
    ];

    for (const testCase of testCases) {
      const actual = getDegreesInRange(testCase.input);
      // we're rounding
      expect(round(actual)).toBe(testCase.expected);
    }
  });
});

describe("getDegrees", () => {
  test("should return degrees from radians", () => {
    const testCases = [
      { input: 0, expected: 0 },
      { input: 1, expected: 57.2958 },
      { input: 2, expected: 114.5916 },
      { input: 3, expected: 171.8873 },
      { input: 4, expected: 229.1831 },
      { input: 5, expected: 286.4788 },
      { input: 6, expected: 343.7746 },
      { input: Math.PI, expected: 180 },
    ];

    for (const testCase of testCases) {
      const actual = getDegrees(testCase.input);
      expect(round(actual)).toBe(round(testCase.expected));
    }
  });
});

describe("getRadians", () => {
  test("should return radians from degrees", () => {
    const testCases = [
      { input: 0, expected: 0 },
      { input: 1, expected: 0.0174533 },
      { input: 2, expected: 0.0349066 },
      { input: 3, expected: 0.0523599 },
      { input: 4, expected: 0.0698132 },
      { input: 5, expected: 0.0872665 },
      { input: 6, expected: 0.1047198 },
      { input: 360, expected: Math.PI * 2 },
    ];

    for (const testCase of testCases) {
      const actual = getRadians(testCase.input);
      expect(round(actual)).toBe(round(testCase.expected));
    }
  });
});

describe("getDaysSinceJ2000", () => {
  test("should return the number of days since J2000", () => {
    const d2000_01_01_12_00_00 = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
    expect(getDaysSinceJ2000(new Date(d2000_01_01_12_00_00))).toBe(0);

    const d2000_01_02_12_00_00 = new Date(Date.UTC(2000, 0, 2, 12, 0, 0));
    expect(getDaysSinceJ2000(new Date(d2000_01_02_12_00_00))).toBe(1);

    const d2008_04_04_15_30_00 = new Date(Date.UTC(2008, 3, 4, 15, 30, 0));
    expect(getDaysSinceJ2000(new Date(d2008_04_04_15_30_00))).toBeGreaterThan(
      3016.1458333
    );
    expect(getDaysSinceJ2000(new Date(d2008_04_04_15_30_00))).toBeLessThan(
      3016.1458334
    );

    const d1998_08_10_23_10_00 = new Date(Date.UTC(1998, 7, 10, 23, 10, 0));
    expect(getDaysSinceJ2000(new Date(d1998_08_10_23_10_00))).toBeLessThan(
      -508.5347
    );
    expect(getDaysSinceJ2000(new Date(d1998_08_10_23_10_00))).toBeGreaterThan(
      -508.5348
    );
  });
});

describe("getLocalSiderealTime", () => {
  test("should return the local siderial time", () => {
    //Find the local siderial time for 2310 UT, 10th August 1998 at Birmingham UK (longitude 1 degree 55 minutes west).
    const d1998_08_10_23_10_00 = new Date(Date.UTC(1998, 7, 10, 23, 10, 0));
    const longitude = -1.9166666666666667;
    const lst = getLocalSiderealTime({
      date: d1998_08_10_23_10_00,
      long: longitude,
    });
    expect(lst).toBeGreaterThan(304.8076);
    expect(lst).toBeLessThan(304.8077);
  });
});

describe("getAltitudeDegrees", () => {
  test("should return the altitude in degrees", () => {
    const altitude = getAltitudeDegrees({
      ha: 54.382617,
      dec: 36.466667,
      lat: 52.5,
    });
    expect(round(altitude)).toBe(round(49.169122));
  });
});

describe("getAltitudeDegreesAtDateAndLatitude", () => {
  test("should return the altitude in degrees", () => {
    const altitude = getAltitudeDegreesAtDateAndLatitude({
      date: new Date(Date.UTC(2021, 0, 1, 12, 0, 0)),
      lat: 52.5,
      long: 0,
      ra: 0,
      dec: 0,
    });
    expect(round(altitude)).toBe(round(0));
  });
});

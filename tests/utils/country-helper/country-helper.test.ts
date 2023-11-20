import {
  findCountryFromCode,
  countriesNotInShippingZones,
  findShippingZoneBasedOnCountry,
} from '../../../server/utils/country-helper/country-helper';
import { IShippingZone } from '../../../types/zonetable';

// @ts-ignore
import countriesData from "../../../server/data/countries.json";

const shippingZones: IShippingZone[] = [
  {
    id: 1,
    name: 'Zone 1',
    countries: [{ code: 'US', name: 'United States' }],
    shippingRatesData: []
  },
  {
    id: 2,
    name: 'Zone 2',
    countries: [{ code: 'CA', name: 'Canada' }],
    shippingRatesData: []
  },
  // Add more shipping zone data as needed
];

describe('findCountryFromCode', () => {
  it('should find a country by code', () => {
    const result = findCountryFromCode('US');
    expect(result).toEqual({ code: 'US', name: 'United States' });
  });

  it('should return undefined for non-existing country code', () => {
    const result = findCountryFromCode('XYZ');
    expect(result).toBeUndefined();
  });
});

describe('countriesNotInShippingZones', () => {
  it('should return countries not present in any shipping zone', () => {
    const result = countriesNotInShippingZones(shippingZones);
    const expectedCountries = countriesData.filter(
      (country) => !shippingZones.some((zone) => zone.countries.some((c) => c.code === country.code))
    );

    expect(result).toEqual(expectedCountries);
  });

  it('should return all countries if no shipping zones are provided', () => {
    const result = countriesNotInShippingZones([]);
    expect(result).toEqual(countriesData);
  });

  // Add more test cases as needed
});

describe('findShippingZoneBasedOnCountry', () => {
  it('should find shipping zone based on country code', () => {
    const result = findShippingZoneBasedOnCountry('US', shippingZones);
    expect(result).toEqual({
      id: 1,
      name: 'Zone 1',
      countries: [{ code: 'US', name: 'United States' }],
      shippingRatesData: []
    });
  });

  it('should return null for non-existing country code', () => {
    const result = findShippingZoneBasedOnCountry('XYZ', shippingZones);
    expect(result).toBeNull();
  });

  it('should return null if no shipping zones are provided', () => {
    const result = findShippingZoneBasedOnCountry('US', []);
    expect(result).toBeNull();
  });

  // Add more test cases as needed
});

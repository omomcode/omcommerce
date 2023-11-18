import countriesData from "../../data/countries.json";
import {IShippingZone} from "../../../../types/zonetable";
import {ICountry} from "../../../../types/country";

export const findCountryFromCode = (code: string) => {
  return  countriesData.find((country) => country.code === code);
}


export const countriesNotInShippingZones = (shippingZones: IShippingZone[]) => {

  const countryCodesInShippingZones = shippingZones.reduce((acc: string[], zone) => {
    const codes = zone.countries.map((country) => country.code);
    return [...acc, ...codes];
  }, []);


  return countriesData.filter((country) => !countryCodesInShippingZones.includes(country.code));
};

export const findShippingZoneBasedOnCountry = (countryCode: string, shippingZones: IShippingZone[]): IShippingZone | null  => {

  for (const zone of shippingZones) {
    // Check if zone.countries is defined before calling find
    if (zone.countries && Array.isArray(zone.countries)) {
      const foundCountry = zone.countries.find((country: any) => country.code === countryCode);
      if (foundCountry) {
        return zone;
      }
    }
  }
  return null;
}

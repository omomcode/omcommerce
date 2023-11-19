import {IShippingZone} from "../../../types/zonetable";
// @ts-ignore
import countriesData from "../../data/countries.json";
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

export const  findShippingZoneBasedOnCountry = (countryCode: string, shippingZones: IShippingZone[]): IShippingZone  => {
  for (const zone of shippingZones) {
    const foundCountry = zone.countries.find((country) => country.code === countryCode);
    if (foundCountry) {
      return zone;
    }
  }
  return null;
}

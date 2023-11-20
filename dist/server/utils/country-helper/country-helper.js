"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findShippingZoneBasedOnCountry = exports.countriesNotInShippingZones = exports.findCountryFromCode = void 0;
// @ts-ignore
const countries_json_1 = __importDefault(require("../../data/countries.json"));
const findCountryFromCode = (code) => {
    return countries_json_1.default.find((country) => country.code === code);
};
exports.findCountryFromCode = findCountryFromCode;
const countriesNotInShippingZones = (shippingZones) => {
    const countryCodesInShippingZones = shippingZones.reduce((acc, zone) => {
        const codes = zone.countries.map((country) => country.code);
        return [...acc, ...codes];
    }, []);
    return countries_json_1.default.filter((country) => !countryCodesInShippingZones.includes(country.code));
};
exports.countriesNotInShippingZones = countriesNotInShippingZones;
const findShippingZoneBasedOnCountry = (countryCode, shippingZones) => {
    for (const zone of shippingZones) {
        // Check if zone.countries is defined before calling find
        if (zone.countries && Array.isArray(zone.countries)) {
            const foundCountry = zone.countries.find((country) => country.code === countryCode);
            if (foundCountry) {
                return zone;
            }
        }
    }
    return null;
};
exports.findShippingZoneBasedOnCountry = findShippingZoneBasedOnCountry;

export interface ICountry {
  code: string,
  name: string,
  checked?: boolean;
}

export interface ICountriesProps {
  assignedCountries?: ICountry[]; //
  nonAssignedCountries?: ICountry[]; //
  getSelectedCountries: (selectedCountries: ICountry[]) => void;
}

import {IShippingRate} from "./rate";
import {Country} from "./country";

export interface IShippingZoneTableProps {
  shippingRatesData: IShippingRate[];
  deleteShippingRate: (id: number) => void;
  editShippingRate: (id: number, data: IShippingRate) => void;
  setShowModal: (show: boolean) => void;
  setSelectedZone: (id: number) => void;
  selectedZone: number
}

export interface IShippingZone {
  id: number;
  name: string;
  countries: Country[];
  shippingRatesData: IShippingRate[];
}

export interface IShippingZoneModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  addShippingZone: (selectedZone: { name: string; countries: any[] }) => void;
  editShippingZone: (arg: YourTypeHere, selectedZone: { name: string; countries: any[] }) => void; // Replace YourTypeHere with the actual type
  assignedZone: YourAssignedZoneType;
  nonAssignedCountries: YourNonAssignedCountriesType;
  errors: Record<string, string>;
}

export interface IShippingRate {
  id: number;
  name: string;
  condition: string;
  price: number;
}

interface IShippingRateModalProps {
  setShowRateModal:  Dispatch<SetStateAction<boolean>>;
  addShippingRate: (zoneId: number, data: IShippingRate) => Promise<void>;
  zoneId: string | number | undefined;
  rateData: Object | null
  mode: string
}

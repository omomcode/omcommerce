import {IShippingZone} from "./zonetable";
import {ITaxes} from "./taxes";

export interface IProduct {
  id: number;
  title: string;
  slug: string;
  description?: string;
  SKU?: string;
  amount_currency_code?: string;
  amount_value: number;
  tax_currency_code: string;
  tax_value: number;
  media?: string[];
  compare_at_price?: string;
  cost_per_item?: string;
  chargeTax: boolean;
  Quantity: number;
  Barcode?: string;
  showQuantity: boolean;
  weight: number;
  measurement_unit?: string;
  omcommerce_tax?: ITaxes;
  omcommerce_shippingzones?: IShippingZone[];
  categories?: number[];
  subcategory?: number;
  amount_value_converted?: number;
  amount_value_converted_currency_code?: string;
}

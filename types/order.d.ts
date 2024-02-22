export interface IOrder {
  order_id: string;
  amount: string;
  status: string;
  currency: string;
  items: string;
  shipping_fee: string;
  tax_total: string;
  customer_name: string;
  customer_surname: string;
  email: string;
  address_line_1: string;
  postal_code: string;
  country_code: string;
  created_at: string;
  updated_at: string;
}

export interface IParsedOrderItem {
  SKU: string;
  name: string;
  quantity: number;
  description: string;
  unit_amount: {
    value: number;
    currency_code: string;
  }
}

export interface IOrderDataNoJSON {
  id: number;
  order_id: string;
  amount: string;
  status: string;
  currency: string;
  items: IParsedOrderItem[];
  shipping_fee: string;
  tax_total: string;
  customer_name: string;
  customer_surname: string;
  email: string;
  address_line_1: string;
  postal_code: string;
  country_code: string;
  created_at: string;
  updated_at: string;
}

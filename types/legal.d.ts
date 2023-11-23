export interface ILegal {
  id: number;
  checked: boolean;
  returnShippingCost: string;
  returnWindow: string;
  restockingFee: number;
  returnPolicy: string;
  privacyPolicy: string;
  termsOfService: string;
  shippingPolicy: string;
  online:string;
}

export interface ILegalReturn {
  id: number;
  data: {
    checked: boolean;
    returnShippingCost: string;
    returnWindow: string;
    restockingFee: number;
    returnPolicy: string;
    privacyPolicy: string;
    termsOfService: string;
    shippingPolicy: string;
    online:string;
  }
}
import React from "react";

export interface ITaxes {
  id: number,
  country_code: string,
  state_code: string,
  rate: number,
  name: string,
  shipping: boolean
}
export interface ITaxesTableProps {
  taxesData: ITaxes[];
  deleteTax: (id: number) => void;
  editTax: (id: number, data: ITaxes) => void;
  setShowTaxesModal: (show: boolean) => void;
}

export interface ITaxesModalProps {
  setShowTaxesModal: React.Dispatch<React.SetStateAction<boolean>>;
  addTax: (tax: ITaxes) => void;
  taxId: number | undefined;
  taxData: ITaxes | undefined;
  mode: string;
}


export interface IPackage {
  id: number,
  name: string,
  type: string,
  length: number,
  width: number,
  height: number,
  weight: number,
  default: boolean
}

export interface IPackageTableProps {
  packageData: IPackage[];
  deletePackage: (id: number) => void;
  editPackage: (id: number, data: IPackage) => void;
  setShowPackageModal: (show: boolean) => void;
  setSelectedPackage: (id: number) => void;
  selectedPackage: number
}

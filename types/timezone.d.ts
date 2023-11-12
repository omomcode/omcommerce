export interface IUnit {
  value: string;
  label: string;
}

export interface IUnitsData {
  [key: string]: IUnit[];
}

export interface IZoneData {
  id: number,
  timezone: string,
  measurement: string,
  unit: string,
  lengthUnit: string
}

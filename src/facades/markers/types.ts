export enum WasteTypes {
  Packing = 'packing',
  Plastic = 'plastic',
  Batteries = 'batteries',
  Carton = 'carton',
  Clothes = 'clothes',
  Paper = 'paper',
  Glass = 'glass'
}

export type ApprovedMarker = {
  id: string;
  position: number[];
  wasteTypes: WasteTypes[];
  address: string;
  date: string;
};

export type ApprovedMarkersList = ApprovedMarker[];

export type NewMarker = {
  position: number[];
  wasteTypes: WasteTypes[];
  address: string;
};

import { MakePartial } from '@commons/types';

export enum MarkerProperties {
  position = 'position',
  wasteTypes = 'wasteTypes',
  address = 'address'
}

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

export type SuggestedMarker = MakePartial<NewMarker>;

export type Marker = {
  id: string;
  position: {
    suggestedValue: number[][];
    approvedValue: number[];
  };
  wasteTypes: {
    suggestedValue: WasteTypes[][];
    approvedValue: WasteTypes[];
  };
  address: {
    suggestedValue: string[];
    approvedValue: string;
  };
  date: string;
};
